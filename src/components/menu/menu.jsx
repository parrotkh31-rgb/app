import React, { useEffect, useState } from "react";
import './menu.css';
import Zagruzka from '../xagruzka/zagruzka';
import SavePage from '../Save/save';
import EditPage from '../Edit/edit';
import FinishedJobsPage from '../FinishedJobs/finishedjobs';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../../firebase';

function Menu({ name, userId, onLogout, TodoMenu }) {
  const [showTodoMenu, setShowTodoMenu] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showFinishedJobs, setShowFinishedJobs] = useState(false);
  const [savedTasks, setSavedTasks] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [isLoadingTodo, setIsLoadingTodo] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isLoadingFinishedJobs, setIsLoadingFinishedJobs] = useState(false);

  useEffect(() => {
    setTasksLoaded(false);
    setSavedTasks([]);
    setFinishedTasks([]);
    setStorageError('');

    try {
      const storedTasks = window.localStorage.getItem(`todo-app:tasks:${userId}`);
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      const storedFinishedTasks = window.localStorage.getItem(`todo-app:finished:${userId}`);
      const loadedFinishedTasks = storedFinishedTasks ? JSON.parse(storedFinishedTasks) : [];
      if (
        !Array.isArray(tasks) ||
        tasks.some((task) => !task || typeof task.title !== 'string') ||
        !Array.isArray(loadedFinishedTasks) ||
        loadedFinishedTasks.some((task) => !task || typeof task.title !== 'string')
      ) {
        throw new Error('Saved task data has an invalid format.');
      }
      setSavedTasks(tasks);
      setFinishedTasks(loadedFinishedTasks);
      setTasksLoaded(true);
    } catch {
      setStorageError('Could not load saved tasks from this browser.');
    }
  }, [userId]);

  useEffect(() => {
    if (!tasksLoaded) return;

    try {
      window.localStorage.setItem(`todo-app:tasks:${userId}`, JSON.stringify(savedTasks));
      window.localStorage.setItem(`todo-app:finished:${userId}`, JSON.stringify(finishedTasks));
      setStorageError('');
    } catch {
      setStorageError('Could not save tasks in this browser. Changes may be lost after refresh.');
    }
  }, [finishedTasks, savedTasks, tasksLoaded, userId]);

  function createTask(task) {
    const slipId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
    setSavedTasks((tasks) => [
      ...tasks,
      { ...task, createdAt: new Date().toISOString(), slipId },
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
      />
    );
  }

  if (showFinishedJobs) {
    return (
      <FinishedJobsPage
        onBack={() => setShowFinishedJobs(false)}
        tasks={finishedTasks}
      />
    );
  }

  return (
    <div>
    <main className="menu-page">
      <section className="menu-account" aria-label="User account">
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