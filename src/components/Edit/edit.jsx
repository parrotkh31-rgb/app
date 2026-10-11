import React, { useEffect, useState } from 'react';
import './edit.css';

function EditPage({ onBack, tasks, onUpdateTask, storageError }) {
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [task, setTask] = useState(null);
  const selectedTask = selectedTaskIndex === null ? null : tasks[selectedTaskIndex];

  useEffect(() => {
    if (selectedTask) {
      setTask({
        title: selectedTask.title || '',
        note: selectedTask.note || '',
        date: selectedTask.date || '',
        startTime: selectedTask.startTime || '',
        endTime: selectedTask.endTime || '',
        category: selectedTask.category || '',
        priority: selectedTask.priority || '',
      });
    } else {
      setTask(null);
    }
  }, [selectedTask]);

  function updateField(event) {
    const { name, value } = event.target;
    setTask((currentTask) => ({ ...currentTask, [name]: value }));
  }

  function saveTask(event) {
    event.preventDefault();
    if (selectedTaskIndex === null || !task) return;

    onUpdateTask(selectedTaskIndex, task);
    setSelectedTaskIndex(null);
  }

  return (
    <main className="edit-page">
      <button
        className="edit-back"
        type="button"
        onClick={() => {
          if (selectedTaskIndex !== null) {
            setSelectedTaskIndex(null);
          } else {
            onBack();
          }
        }}
      >
        {selectedTaskIndex === null ? 'Back to menu' : 'Back to tasks'}
      </button>
      <h1 className="edit-title">{selectedTask ? 'Edit Task' : 'Edit Tasks'}</h1>
      {storageError && <p className="edit-storage-error" role="alert">{storageError}</p>}
      {selectedTaskIndex === null ? (
        <section className="edit-task-list" aria-label="Tasks to edit">
          {tasks.length === 0 ? (
            <p className="edit-empty">No tasks available to edit.</p>
          ) : (
            tasks.map((savedTask, index) => (
              <button
                className="edit-task-button"
                type="button"
                key={`${savedTask.title}-${index}`}
                onClick={() => setSelectedTaskIndex(index)}
              >
                {savedTask.title}
              </button>
            ))
          )}
        </section>
      ) : task && (
        <form className="edit-task-form" onSubmit={saveTask}>
          <div className="edit-form-group">
            <label htmlFor="edit-task-title">Title</label>
            <input
              id="edit-task-title"
              name="title"
              type="text"
              value={task.title}
              onChange={updateField}
              required
            />
          </div>
          <div className="edit-form-group">
            <label htmlFor="edit-task-note">Note</label>
            <textarea
              id="edit-task-note"
              name="note"
              rows="4"
              value={task.note}
              onChange={updateField}
              required
            />
          </div>
          <div className="edit-form-row">
            <div className="edit-form-group">
              <label htmlFor="edit-task-date">Date</label>
              <input
                id="edit-task-date"
                name="date"
                type="date"
                value={task.date}
                onChange={updateField}
                required
              />
            </div>
            <div className="edit-form-group">
              <label htmlFor="edit-task-start-time">Start Time</label>
              <input
                id="edit-task-start-time"
                name="startTime"
                type="time"
                value={task.startTime}
                onChange={updateField}
                required
              />
            </div>
            <div className="edit-form-group">
              <label htmlFor="edit-task-end-time">End Time</label>
              <input
                id="edit-task-end-time"
                name="endTime"
                type="time"
                value={task.endTime}
                onChange={updateField}
                required
              />
            </div>
          </div>
          <div className="edit-form-row">
            <div className="edit-form-group">
              <label htmlFor="edit-task-category">Category</label>
              <select
                id="edit-task-category"
                name="category"
                value={task.category}
                onChange={updateField}
                required
              >
                <option value="">Choose Category</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>
            <div className="edit-form-group">
              <label htmlFor="edit-task-priority">Priority</label>
              <select
                id="edit-task-priority"
                name="priority"
                value={task.priority}
                onChange={updateField}
                required
              >
                <option value="">Choose Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="edit-form-actions">
            <button
              className="edit-cancel"
              type="button"
              onClick={() => setSelectedTaskIndex(null)}
            >
              Cancel
            </button>
            <button className="edit-save" type="submit">Save Changes</button>
          </div>
        </form>
      )}
    </main>
  );
}

export default EditPage;