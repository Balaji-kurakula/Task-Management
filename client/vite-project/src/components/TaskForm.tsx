import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TASK } from '../graphql/mutations';
import './TaskForm.css';

interface TaskFormProps {
  onTaskAdded: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(0);
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('');

  const [createTask, { loading }] = useMutation(CREATE_TASK);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({
        variables: {
          input: {
            title,
            description: description || undefined,
            priority,
            category: category || undefined,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            isRecurring,
            recurrencePattern: isRecurring ? recurrencePattern : undefined
          }
        }
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPriority(0);
      setCategory('');
      setDueDate('');
      setIsRecurring(false);
      setRecurrencePattern('');

      onTaskAdded();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className='form-text'>
        <div className="form-row">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-row">
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
          />
        </div>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="form-select"
          >
            <option value={0}>None</option>
            <option value={1}>Low</option>
            <option value={2}>Medium</option>
            <option value={3}>High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row recurring-checkbox">
        <input
          type="checkbox"
          id="isRecurring"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
        />
        <label htmlFor="isRecurring">Recurring Task</label>
      </div>

      {isRecurring && (
        <div className="form-row">
          <select
            value={recurrencePattern}
            onChange={(e) => setRecurrencePattern(e.target.value)}
            className="form-select"
            required={isRecurring}
          >
            <option value="">Select Recurrence Pattern</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      )}

      <div className="form-row">
        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;