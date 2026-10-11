import React, { useEffect, useState } from "react";
import './todomenu.css';
import NewTask from '../newtask/newtask';
import Zagruzka from '../xagruzka/zagruzka';

function Todomenu({ onBack, onCreateTask }) {
    const [showNewTask, setShowNewTask] = useState(false);
    const [isLoadingNewTask, setIsLoadingNewTask] = useState(false);

    useEffect(() => {
        if (!isLoadingNewTask) return undefined;

        const timeoutId = window.setTimeout(() => {
            setIsLoadingNewTask(false);
            setShowNewTask(true);
        }, 1000);

        return () => window.clearTimeout(timeoutId);
    }, [isLoadingNewTask]);

    if (isLoadingNewTask) {
        return (
            <main className="task-loading-page">
                <div className="task-loading-content" role="status" aria-live="polite">
                    <Zagruzka />
                    <p>Loading new task...</p>
                </div>
            </main>
        );
    }

    if (showNewTask) {
        return (
            <NewTask
                onBack={() => setShowNewTask(false)}
                onCreateTask={(task) => {
                    onCreateTask(task);
                    setShowNewTask(false);
                }}
            />
        );
    }

    return (
        <main className="todo-menu-page">
            <button className="todo-menu-back" type="button" onClick={onBack}>
                Back to menu
            </button>
            <button className="task-create-button" type="button" onClick={() => setIsLoadingNewTask(true)}>
                <span className="task-create-icon" aria-hidden="true">
                    <span className="task-create-pencil"></span>
                    <span className="task-create-folder">
                        <span className="task-create-folder-top">
                            <svg viewBox="0 0 24 27">
                                <path d="M1,0 L23,0 C23.5522847,-1.01453063e-16 24,0.44771525 24,1 L24,8.17157288 C24,8.70200585 23.7892863,9.21071368 23.4142136,9.58578644 L20.5857864,12.4142136 C20.2107137,12.7892863 20,13.2979941 20,13.8284271 L20,26 C20,26.5522847 19.5522847,27 19,27 L1,27 C0.44771525,27 6.76353751e-17,26.5522847 0,26 L0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 Z"></path>
                            </svg>
                        </span>
                        <span className="task-create-paper"></span>
                    </span>
                </span>
                Create a new task
            </button>
        </main>
    );
}

export default Todomenu;