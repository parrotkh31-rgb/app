import React, { useEffect, useRef, useState } from "react";
import './menu.css';
import Zagruzka from '../xagruzka/zagruzka';
import SavePage from '../Save/save';
import EditPage from '../Edit/edit';
import FinishedJobsPage from '../FinishedJobs/finishedjobs';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, onSnapshot, runTransaction, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

function Menu({ name, userId, onLogout, TodoMenu }) {
  const [showTodoMenu, setShowTodoMenu] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showFinishedJobs, setShowFinishedJobs] = useState(false);
  const [savedTasks, setSavedTasks] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [connectionError, setConnectionError] = useState('');
  const [syncAttempt, setSyncAttempt] = useState(0);
  const [isLoadingTodo, setIsLoadingTodo] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isLoadingFinishedJobs, setIsLoadingFinishedJobs] = useState(false);
  const syncedTasksRef = useRef('');
  const pendingWritesRef = useRef(Promise.resolve());

  useEffect(() => {
    setTasksLoaded(false);
    setSavedTasks([]);
    setFinishedTasks([]);
    setStorageError('');
    setConnectionError('');
    syncedTasksRef.current = '';
    let isCancelled = false;
    let unsubscribe = () => {};

    function readLocalTasks(key) {
      const storedValue = window.localStorage.getItem(key);
      const parsed = storedValue ? JSON.parse(storedValue) : [];
      if (!Array.isArray(parsed) || parsed.some((task) => !task || typeof task.title !== 'string')) {
        throw new Error('Saved task data has an invalid format.');
      }
      return parsed;
    }

    function addTaskIds(tasks, type) {
      return tasks.map((task, index) => {
        const taskId = task.taskId || task.slipId || `legacy-${type}-${index}-${task.title}`;
        return { ...task, taskId };
      });
    }

    function mergeTasks(remoteTasks, localTasks) {
      const byId = new Map(remoteTasks.map((task) => [task.taskId, task]));
      localTasks.forEach((task) => byId.set(task.taskId, task));
      return Array.from(byId.values());
    }

    function normalizeCloudData(data) {
      const activeTasks = data.activeTasks;
      const completedTasks = data.completedTasks;
      if (
        !Array.isArray(activeTasks) ||
        !Array.isArray(completedTasks) ||
        activeTasks.some((task) => !task || typeof task.title !== 'string') ||
        completedTasks.some((task) => !task || typeof task.title !== 'string')
      ) {
        throw new Error('Cloud task data has an invalid format.');
      }
      return {
        activeTasks: addTaskIds(activeTasks, 'active'),
        completedTasks: addTaskIds(completedTasks, 'completed'),
      };
    }

    async function connectTasks() {
      try {
        const localTasks = addTaskIds(
          readLocalTasks(`todo-app:tasks:${userId}`),
          'active'
        );
        const localFinishedTasks = addTaskIds(
          readLocalTasks(`todo-app:finished:${userId}`),
          'completed'
        );
        const migrationKey = `todo-app:cloud-migrated:${userId}`;
        const shouldMigrateLocalTasks = window.localStorage.getItem(migrationKey) !== 'true';
        const userTasksRef = doc(db, 'userTasks', userId);

        const initialData = await runTransaction(db, async (transaction) => {
          const userTasksSnapshot = await transaction.get(userTasksRef);
          const remoteData = userTasksSnapshot.exists()
            ? normalizeCloudData(userTasksSnapshot.data())
            : { activeTasks: [], completedTasks: [] };
          const activeTasks = shouldMigrateLocalTasks
            ? mergeTasks(remoteData.activeTasks, localTasks)
            : userTasksSnapshot.exists() ? remoteData.activeTasks : localTasks;
          const completedTasks = shouldMigrateLocalTasks
            ? mergeTasks(remoteData.completedTasks, localFinishedTasks)
            : userTasksSnapshot.exists() ? remoteData.completedTasks : localFinishedTasks;
          const completedIds = new Set(completedTasks.map((task) => task.taskId));
          const data = {
            activeTasks: activeTasks.filter((task) => !completedIds.has(task.taskId)),
            completedTasks,
          };
          transaction.set(userTasksRef, data);
          return data;
        });

        if (isCancelled) return;
        window.localStorage.setItem(migrationKey, 'true');
        const initialSerialized = JSON.stringify(initialData);
        syncedTasksRef.current = initialSerialized;
        setSavedTasks(initialData.activeTasks);
        setFinishedTasks(initialData.completedTasks);
        setTasksLoaded(true);

        unsubscribe = onSnapshot(userTasksRef, (snapshot) => {
          try {
            if (!snapshot.exists()) {
              throw new Error('Cloud task data is missing.');
            }
            const cloudData = normalizeCloudData(snapshot.data());
            const completedIds = new Set(cloudData.completedTasks.map((task) => task.taskId));
            cloudData.activeTasks = cloudData.activeTasks.filter((task) => !completedIds.has(task.taskId));
            syncedTasksRef.current = JSON.stringify(cloudData);
            setSavedTasks(cloudData.activeTasks);
            setFinishedTasks(cloudData.completedTasks);
            window.localStorage.setItem(`todo-app:tasks:${userId}`, JSON.stringify(cloudData.activeTasks));
            window.localStorage.setItem(`todo-app:finished:${userId}`, JSON.stringify(cloudData.completedTasks));
            setStorageError('');
          } catch (error) {
            setStorageError(error.message || 'Could not read synced tasks.');
          }
        }, (error) => {
          setStorageError(`Could not sync tasks with the cloud: ${error.message}`);
        });
      } catch (error) {
        if (isCancelled) return;
        setConnectionError(`Could not connect to cloud tasks: ${error.message}`);
      }
    }

    connectTasks();
    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, [syncAttempt, userId]);

  useEffect(() => {
    if (!tasksLoaded) return;

    try {
      window.localStorage.setItem(`todo-app:tasks:${userId}`, JSON.stringify(savedTasks));
      window.localStorage.setItem(`todo-app:finished:${userId}`, JSON.stringify(finishedTasks));
    } catch {
      setStorageError('Could not update the local task cache. Cloud tasks are still being synced.');
    }
  }, [finishedTasks, savedTasks, tasksLoaded, userId]);

  useEffect(() => {
    if (!tasksLoaded) return;
    const userTasksRef = doc(db, 'userTasks', userId);
    const data = { activeTasks: savedTasks, completedTasks: finishedTasks };
    const serialized = JSON.stringify(data);
    if (serialized === syncedTasksRef.current) return;

    pendingWritesRef.current = pendingWritesRef.current
      .catch(() => {})
      .then(() => setDoc(userTasksRef, data))
      .then(() => {
        syncedTasksRef.current = serialized;
        setStorageError('');
      })
      .catch((error) => {
        setStorageError(`Could not sync tasks with the cloud: ${error.message}`);
      });
  }, [finishedTasks, savedTasks, tasksLoaded, userId]);

  function createTask(task) {
    const taskId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
    setSavedTasks((tasks) => [
      ...tasks,
      { ...task, taskId, createdAt: new Date().toISOString(), slipId: taskId },
    ]);
  }

  function finishTask(taskIndex) {
    const task = savedTasks[taskIndex];
    if (!task) return;

    setFinishedTasks((tasks) => [...tasks, { ...task, finishedAt: new Date().toISOString() }]);
    setSavedTasks((tasks) => tasks.filter((_, index) => index !== taskIndex));
  }

  function deleteTask(taskIndex) {
    setSavedTasks((tasks) => tasks.filter((_, index) => index !== taskIndex));
  }

  function updateTask(taskIndex, updatedTask) {
    setSavedTasks((tasks) => tasks.map((task, index) => (
      index === taskIndex ? { ...task, ...updatedTask } : task
    )));
  }

  async function verifyAccountPassword(password) {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('Could not verify the signed-in account.');
    }

    await reauthenticateWithCredential(
      user,
      EmailAuthProvider.credential(user.email, password)
    );
  }

  function retryCloudSync() {
    setSyncAttempt((attempt) => attempt + 1);
  }

  useEffect(() => {
    if (!isLoadingTodo && !isLoadingSave && !isLoadingEdit && !isLoadingFinishedJobs) return undefined;

    const timeoutId = window.setTimeout(() => {
      setIsLoadingTodo(false);
      setIsLoadingSave(false);
      setIsLoadingEdit(false);
      setIsLoadingFinishedJobs(false);
      if (isLoadingTodo) setShowTodoMenu(true);
      if (isLoadingSave) setShowSave(true);
      if (isLoadingEdit) setShowEdit(true);
      if (isLoadingFinishedJobs) setShowFinishedJobs(true);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [isLoadingTodo, isLoadingSave, isLoadingEdit, isLoadingFinishedJobs]);

  if (isLoadingTodo || isLoadingSave || isLoadingEdit || isLoadingFinishedJobs) {
    return (
      <main className="todo-loading-page">
        <div className="todo-loading-content" role="status" aria-live="polite">
          <Zagruzka />
          <p>
            {isLoadingTodo
              ? 'Loading To Do...'
              : isLoadingSave
                ? 'Saving...'
                : isLoadingEdit
                  ? 'Loading Edit...'
                  : 'Loading Finished Jobs...'}
          </p>
        </div>
      </main>
    );
  }

  if (!tasksLoaded) {
    return (
      <main className="todo-loading-page">
        <div className="todo-loading-content" role={connectionError ? 'alert' : 'status'} aria-live="polite">
          {connectionError ? (
            <>
              <p>{connectionError}</p>
              <button type="button" onClick={retryCloudSync}>Retry sync</button>
            </>
          ) : (
            <>
              <Zagruzka />
              <p>Syncing your tasks...</p>
            </>
          )}
        </div>
      </main>
    );
  }

  if (showTodoMenu) {
    return (
      <TodoMenu
        onBack={() => setShowTodoMenu(false)}
        onCreateTask={createTask}
      />
    );
  }

  if (showSave) {
    return (
      <SavePage
        onBack={() => setShowSave(false)}
        tasks={savedTasks}
        storageError={storageError}
        onFinishTask={finishTask}
        onDeleteTask={deleteTask}
        onVerifyPassword={verifyAccountPassword}
      />
    );
  }

  if (showEdit) {
    return (
      <EditPage
        onBack={() => setShowEdit(false)}
        tasks={savedTasks}
        onUpdateTask={updateTask}
        storageError={storageError}
      />
    );
  }

  if (showFinishedJobs) {
    return (
      <FinishedJobsPage
        onBack={() => setShowFinishedJobs(false)}
        tasks={finishedTasks}
        storageError={storageError}
      />
    );
  }

  return (
    <div>
    <main className="menu-page">
      <section className="menu-account" aria-label="User account">
        {storageError && <p className="menu-sync-error" role="alert">{storageError}</p>}
        <h1 className="menu-account-name">
          Hello, {name}! <span aria-hidden="true">👋</span>
        </h1>
        <button className="menu-logout" type="button" onClick={onLogout}>
          Log Out
        </button>

        <div className="menu-action-box">
          <button className="todo-button todo-button-tasks" type="button" onClick={() => setIsLoadingTodo(true)}>
            <div><div><div>To Do 📝</div></div></div>
          </button>
          <button className="todo-button todo-button-save" type="button" onClick={() => setIsLoadingSave(true)}>
            <div><div><div>Tasks 💾</div></div></div>
          </button>
          <button className="todo-button todo-button-edit" type="button" onClick={() => setIsLoadingEdit(true)}>
            <div><div><div>Edit ✏️</div></div></div>
          </button>
          <button className="todo-button todo-button-finished" type="button" onClick={() => setIsLoadingFinishedJobs(true)}>
            <div><div><div>Finished Jobs ✅</div></div></div>
          </button>
        </div>


      </section>
    </main>
    </div>
  );
}

export default Menu;