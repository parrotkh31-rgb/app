import React, { useEffect, useRef, useState } from 'react';
import './newtask.css';

function NewTask({ onBack, onCreateTask }) {
    const [task, setTask] = useState({
        title: '',
        note: '',
        date: '',
        startTime: '',
        endTime: '',
        category: '',
        priority: '',
    });
    const [isCreated, setIsCreated] = useState(false);
    const createTimeout = useRef(null);

    useEffect(() => () => {
        if (createTimeout.current !== null) {
            window.clearTimeout(createTimeout.current);
        }
    }, []);

    function updateTask(event) {
        const { name, value } = event.target;
        setTask((currentTask) => ({ ...currentTask, [name]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (isCreated) return;

        setIsCreated(true);
        createTimeout.current = window.setTimeout(() => {
            createTimeout.current = null;
            onCreateTask(task);
        }, 2000);
    }

    return (
        <main className="new-task-page">

            <div className="new-task-container">

                <button
                    className="new-task-back"
                    type="button"
                    onClick={onBack}
                >
                    <span className="back-arrow">←</span>
                    <span>Back to tasks</span>
                </button>

                <div className="new-task-header">
                    <h1>Create New Task</h1>
                    <p>Add something new to your task list.</p>
                </div>

                <form className="new-task-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter task title..."
                            value={task.title}
                            onChange={updateTask}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Note</label>
                        <textarea
                            name="note"
                            placeholder="Write something about your task..."
                            rows="4"
                            value={task.note}
                            onChange={updateTask}
                            required
                        ></textarea>
                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label>Date</label>
                            <input
                                type="date"
                                name="date"
                                value={task.date}
                                onChange={updateTask}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Start Time</label>
                            <input
                                type="time"
                                name="startTime"
                                value={task.startTime}
                                onChange={updateTask}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>End Time</label>
                            <input
                                type="time"
                                name="endTime"
                                value={task.endTime}
                                onChange={updateTask}
                                required
                            />
                        </div>

                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label>Category</label>

                            <select
                                name="category"
                                value={task.category}
                                onChange={updateTask}
                                required
                            >
                                <option value="">Choose Category</option>
                                <option value="Personal">Personal</option>
                                <option value="Work">Work</option>
                                <option value="Study">Study</option>
                                <option value="Shopping">Shopping</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Priority</label>

                            <select
                                name="priority"
                                value={task.priority}
                                onChange={updateTask}
                                required
                            >
                                <option value="">Choose Priority</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                    </div>

                    <div className="new-task-buttons">

                        <button
                            type="button"
                            className="new-task-cancel"
                            onClick={onBack}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="new-task-submit"
                        >
                            <span>Create Task</span>
                            <span className="submit-arrow">→</span>
                        </button>

                    </div>

                </form>

            </div>

            {isCreated && (
                <div className="new-task-success" role="status" aria-live="polite">
                    <div className="new-task-success-card">
                        <div className="new-task-success-check" aria-hidden="true">
                            <svg viewBox="0 0 64 64">
                                <path d="M16 33.5 27 44l22-24" />
                            </svg>
                        </div>
                        <h2>Task created!</h2>
                        <p>Your task is in the Tasks page</p>
                    </div>
                </div>
            )}

        </main>
    );
}

export default NewTask;