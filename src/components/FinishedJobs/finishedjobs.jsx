import React, { useEffect, useState } from 'react';
import './finishjob.css';
import '../Save/save.css';
import Zagruzka from '../xagruzka/zagruzka';

function formatFinishedAt(finishedAt) {
  if (!finishedAt) return 'Completion date unavailable';

  const date = new Date(finishedAt);
  if (Number.isNaN(date.getTime())) return 'Completion date unavailable';

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatTaskDate(dateValue) {
  if (!dateValue) return 'Not set';

  const [year, month, day] = dateValue.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return dateValue;

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatTaskTime(timeValue) {
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

function FinishedJobsPage({ onBack, tasks = [], storageError = '' }) {
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [pendingTaskIndex, setPendingTaskIndex] = useState(null);
  const selectedTask = selectedTaskIndex === null ? null : tasks[selectedTaskIndex];

  useEffect(() => {
    if (pendingTaskIndex === null) return undefined;

    const timeoutId = window.setTimeout(() => {
      setSelectedTaskIndex(pendingTaskIndex);
      setPendingTaskIndex(null);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [pendingTaskIndex]);

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
          Back to finished jobs
        </button>
        <article className="task-receipt" aria-label={`Finished task: ${selectedTask.title}`}>
          <div className="receipt-rule receipt-rule-top" aria-hidden="true"></div>
          <header className="receipt-header">
            <h1>FINISHED TASK</h1>
            <svg className="receipt-calendar" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="1" />
              <path d="M7 3v4M17 3v4M3 10h18M7 14h2M12 14h2M7 17h2" />
            </svg>
          </header>
          <p className="receipt-created-label">COMPLETED</p>
          <p className="receipt-created-at">{formatFinishedAt(selectedTask.finishedAt)}</p>
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
            <div><dt>Date</dt><dd>{formatTaskDate(selectedTask.date)}</dd></div>
            <div><dt>Start</dt><dd>{formatTaskTime(selectedTask.startTime)}</dd></div>
            <div><dt>End</dt><dd>{formatTaskTime(selectedTask.endTime)}</dd></div>
            <div><dt>Category</dt><dd>{selectedTask.category || '—'}</dd></div>
          </dl>
          <div className="receipt-rule" aria-hidden="true"></div>
          <p className="receipt-slip-id">
            TASK SLIP ID: {selectedTask.slipId || `TASK-${String(selectedTaskIndex + 1).padStart(4, '0')}`}
          </p>
        </article>
      </main>
    );
  }

  return (
    <main className="finished-jobs-page">
      <button className="finished-jobs-back" type="button" onClick={onBack}>
        Back to menu
      </button>
      <h1 className="finished-jobs-title">Finished Jobs</h1>
      {storageError && <p className="finished-jobs-error" role="alert">{storageError}</p>}
      <section className="finished-jobs-list" aria-label="Finished tasks">
        {tasks.length === 0 ? (
          <p className="finished-jobs-empty">No finished tasks yet.</p>
        ) : (
          tasks.map((task, index) => (
            <button
              className="finished-job-item"
              key={`${task.title}-${index}`}
              type="button"
              onClick={() => setPendingTaskIndex(index)}
            >
              <span aria-hidden="true">✓</span>
              <span className="finished-job-info">
                <span className="finished-job-title">{task.title}</span>
                <span className="finished-job-date">
                  Completed: {formatFinishedAt(task.finishedAt)}
                </span>
              </span>
            </button>
          ))
        )}
      </section>
    </main>
  );
}

export default FinishedJobsPage;
