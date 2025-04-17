import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_RECURRING_TASKS } from '../graphql/queries';
import { CREATE_RECURRING_TASK_INSTANCE } from '../graphql/mutations';
// import './RecurringTasksPanel.css';

interface RecurringTasksPanelProps {
  onTaskCreated: () => void;
}

const RecurringTasksPanel: React.FC<RecurringTasksPanelProps> = ({ onTaskCreated }) => {
  const { loading, error, data, refetch } = useQuery(GET_RECURRING_TASKS);
  const [createInstance, { loading: creating }] = useMutation(CREATE_RECURRING_TASK_INSTANCE);

  const handleCreateInstance = async (id: number) => {
    try {
      await createInstance({ variables: { id } });
      alert('Task instance created successfully!');
      refetch();
      onTaskCreated();
    } catch (error) {
      console.error('Error creating task instance:', error);
      alert('Failed to create task instance');
    }
  };

  if (loading) return <p>Loading recurring tasks...</p>;
  if (error) return <p>Error loading recurring tasks: {error.message}</p>;

  const recurringTasks = data?.tasks.filter((task: any) => task.isRecurring) || [];

  if (recurringTasks.length === 0) {
    return (
      <div className="recurring-tasks-empty">
        <h2>No Recurring Tasks</h2>
        <p>You haven't created any recurring tasks yet. Create a new task and mark it as recurring.</p>
      </div>
    );
  }

  return (
    <div className="recurring-tasks-panel">
      <h2>Recurring Tasks</h2>
      <p className="panel-description">
        These are your recurring task templates. Create new instances from these templates when needed.
      </p>

      <div className="recurring-tasks-list">
        {recurringTasks.map((task: any) => (
          <div key={task.id} className="recurring-task-item">
            <div className="recurring-task-info">
              <h3>{task.title}</h3>
              {task.description && <p>{task.description}</p>}
              <div className="recurring-task-meta">
                <span className="recurring-pattern">Pattern: {task.recurrencePattern}</span>
                {task.lastRecurrenceDate && (
                  <span className="last-created">
                    Last created: {new Date(task.lastRecurrenceDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <button 
              className="create-instance-btn"
              onClick={() => handleCreateInstance(task.id)}
              disabled={creating}
            >
              Create Instance
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RecurringTasksPanel;
