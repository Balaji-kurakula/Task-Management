import React from 'react';
import { useMutation } from '@apollo/client';
import { Task } from '../types/Task';
import { TOGGLE_TASK_STATUS, DELETE_TASK } from '../graphql/mutations';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdated }) => {
  const [toggleTaskStatus] = useMutation(TOGGLE_TASK_STATUS);
  const [deleteTask] = useMutation(DELETE_TASK);

  const handleToggleStatus = async (id: number) => {
    await toggleTaskStatus({ variables: { id } });
    onTaskUpdated();
  };

  const handleDeleteTask = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask({ variables: { id } });
      onTaskUpdated();
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  if (!tasks || tasks.length === 0) {
    return <p className="no-tasks">No tasks found.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div 
          key={task.id} 
          className={`task-item ${task.completed ? 'completed' : ''}`}
          style={{ borderLeft: `5px solid ${getPriorityColor(task.priority)}` }}
        >
          <div className="task-header">
            <div className="task-title-row">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleStatus(task.id)}
              />
              <h3>{task.title}</h3>
              {task.isRecurring && <span className="recurring-badge">↻ Recurring</span>}
            </div>
            <div className="task-actions">
              <button 
                className="delete-btn"
                onClick={() => handleDeleteTask(task.id)}
              >
                ×
              </button>
            </div>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          
          <div className="task-meta">
            {task.category && (
              <span className="task-category">{task.category}</span>
            )}
            {task.dueDate && (
              <span className={`task-due-date ${isOverdue(task) ? 'overdue' : ''}`}>
                Due: {formatDate(task.dueDate)}
              </span>
            )}
            <span className="task-created">
              Created: {formatDate(task.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const getPriorityColor = (priority: number): string => {
  switch (priority) {
    case 3: return '#e74c3c'; // High - red
    case 2: return '#f39c12'; // Medium - orange
    case 1: return '#3498db'; // Low - blue
    default: return '#95a5a6'; // None - gray
  }
};

const isOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.completed) return false;
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  return dueDate < now;
};

export default TaskList;