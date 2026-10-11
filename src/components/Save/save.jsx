import React, { useEffect, useState } from 'react';
import './save.css';
import Zagruzka from '../xagruzka/zagruzka';

function formatCreatedAt(createdAt) {
  if (!createdAt) return 'Creation time unavailable';

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return 'Creation time unavailable';

  const dateText = new Intl.DateTimeFormat('uz-UZ', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
  const timeText = new Intl.DateTimeFormat('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  return `${dateText}, ${timeText}`;
}

function formatDate(dateValue) {
  if (!dateValue) return 'Not set';

  const [year, month, day] = dateValue.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return dateValue;

  return new Intl.DateTimeFormat('uz-UZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatTime(timeValue) {
  if (!timeValue) return 'Not set';
  const [hours, minutes] = timeValue.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return timeValue;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function SavePage({
  onBack,
  tasks,
  storageError,
  onFinishTask,
  onDeleteTask,
  onVerifyPassword,
}) {
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [pendingTaskIndex, setPendingTaskIndex] = useState(null);
  const [isDeletePromptOpen, setIsDeletePromptOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [passwordAccepted, setPasswordAccepted] = useState(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const selectedTask = selectedTaskIndex === null ? null : tasks[selectedTaskIndex];

  useEffect(() => {
    if (pendingTaskIndex === null) return undefined;

    const timeoutId = window.setTimeout(() => {
      setSelectedTaskIndex(pendingTaskIndex);
      setPendingTaskIndex(null);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [pendingTaskIndex]);

  function finishSelectedTask() {
    if (selectedTaskIndex === null) return;
    onFinishTask(selectedTaskIndex);
    setSelectedTaskIndex(null);
  }

  function deleteSelectedTask() {
    if (selectedTaskIndex === null) return;
    onDeleteTask(selectedTaskIndex);
    setSelectedTaskIndex(null);
    setIsDeletePromptOpen(false);
  }

  function beginDelete() {
    setDeletePassword('');
    setDeleteConfirmation('');
    setPasswordAccepted(false);
    setDeleteError('');
    setIsDeletePromptOpen(true);
  }

  async function verifyDeletePassword(event) {
    event.preventDefault();
    setIsVerifyingPassword(true);
    setDeleteError('');

    try {
      await onVerifyPassword(deletePassword);
      setPasswordAccepted(true);
      setDeletePassword('');
    } catch (error) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setDeleteError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        setDeleteError('Too many attempts. Please try again later.');
      } else {
        setDeleteError(error.message || 'Could not verify your password. Please try again.');
      }
    } finally {
      setIsVerifyingPassword(false);
    }
  }

  if (pendingTaskIndex !== null) {
    return (
      <main className="save-loading-page">
        <div className="save-loading-content" role="status" aria-live="polite">
          <Zagruzka />
          <p>Opening task...</p>
        </div>
      </main>
    );
  }

  if (selectedTask) {
    return (
      <main className="save-page save-detail-page">
        <button
          className="save-back"
          type="button"
          onClick={() => setSelectedTaskIndex(null)}
        >
          Back to tasks
        </button>
        {storageError && <p className="save-storage-error" role="alert">{storageError}</p>}
        <article className="task-receipt" aria-label={`Task receipt: ${selectedTask.title}`}>
          <div className="receipt-rule receipt-rule-top" aria-hidden="true"></div>
          <header className="receipt-header">
            <h1>TASK RECEIPT</h1>
            <svg className="receipt-calendar" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="1" />
              <path d="M7 3v4M17 3v4M3 10h18M7 14h2M12 14h2M7 17h2" />
            </svg>
          </header>
          <p className="receipt-created-label">CREATED</p>
          <p className="receipt-created-at">{formatCreatedAt(selectedTask.createdAt)}</p>
          <div className="receipt-rule" aria-hidden="true"></div>
          <div className="receipt-task-heading">
            <h2>{selectedTask.title}</h2>
            {selectedTask.priority && (
              <span className={`receipt-priority receipt-priority-${selectedTask.priority.toLowerCase()}`}>
                {selectedTask.priority}
              </span>
            )}
          </div>
          <dl className="receipt-details">
            <div><dt>Note</dt><dd>{selectedTask.note || '—'}</dd></div>
            <div><dt>Date</dt><dd>{formatDate(selectedTask.date)}</dd></div>
            <div><dt>Start</dt><dd>{formatTime(selectedTask.startTime)}</dd></div>
            <div><dt>End</dt><dd>{formatTime(selectedTask.endTime)}</dd></div>
            <div><dt>Category</dt><dd>{selectedTask.category || '—'}</dd></div>
          </dl>
          <div className="receipt-rule" aria-hidden="true"></div>
          <section className="receipt-actions" aria-label="Task actions">
            <h3>ACTIONS</h3>
            <div className="receipt-action-buttons">
              <button className="receipt-finish" type="button" onClick={finishSelectedTask}>
                Finish
              </button>
              <button className="receipt-delete" type="button" onClick={beginDelete}>
                Delete
              </button>
            </div>
          </section>
          <p className="receipt-slip-id">
            TASK SLIP ID: {selectedTask.slipId || `TASK-${String(selectedTaskIndex + 1).padStart(4, '0')}`}
          </p>
        </article>
        {isDeletePromptOpen && (
          <div className="delete-confirm-backdrop">
            <section
              className="delete-confirm-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-confirm-title"
            >
              <button
                className="delete-confirm-close"
                type="button"
                aria-label="Cancel delete"
                onClick={() => setIsDeletePromptOpen(false)}
              >
                ×
              </button>
              {!passwordAccepted ? (
                <form onSubmit={verifyDeletePassword}>
                  <h2 id="delete-confirm-title">Verify your password</h2>
                  <p>Enter your account password to continue deleting this task.</p>
                  <label htmlFor="delete-account-password">Account password</label>
                  <input
                    id="delete-account-password"
                    type="password"
                    value={deletePassword}
                    onChange={(event) => setDeletePassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    autoFocus
                  />
                  {deleteError && <p className="delete-confirm-error" role="alert">{deleteError}</p>}
                  <button
                    className="delete-confirm-submit"
                    type="submit"
                    disabled={isVerifyingPassword}
                  >
                    {isVerifyingPassword ? 'Checking...' : 'Verify password'}
                  </button>
                </form>
              ) : (
                <div>
                  <h2 id="delete-confirm-title">Password accepted</h2>
                  <p>To confirm deletion, type <strong>delete</strong> below.</p>
                  <label htmlFor="delete-confirmation-text">Type delete to confirm</label>
                  <input
                    id="delete-confirmation-text"
                    type="text"
                    value={deleteConfirmation}
                    onChange={(event) => setDeleteConfirmation(event.target.value)}
                    autoComplete="off"
                    autoFocus
                  />
                  {deleteError && <p className="delete-confirm-error" role="alert">{deleteError}</p>}
                  <button
                    className="delete-confirm-submit delete-confirm-final"
                    type="button"
                    onClick={deleteSelectedTask}
                    disabled={deleteConfirmation !== 'delete'}
                  >
                    Delete task
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="save-page">
      <button className="save-back" type="button" onClick={onBack}>
        Back to menu
      </button>
      <h1 className="save-title">Tasks</h1>
      {storageError && <p className="save-storage-error" role="alert">{storageError}</p>}
      <section className="save-task-list" aria-label="Saved tasks">
        {tasks.length === 0 ? (
          <p className="save-empty">No saved tasks yet.</p>
        ) : (
          tasks.map((task, index) => (
            <button
              className="save-task-button"
              type="button"
              key={`${task.title}-${index}`}
              onClick={() => setPendingTaskIndex(index)}
            >
              {task.title}
            </button>
          ))
        )}
      </section>
    </main>
  );
}

export default SavePage;