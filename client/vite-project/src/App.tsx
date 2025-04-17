import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_TASKS, GET_TASKS_BY_STATUS } from './graphql/queries';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import RecurringTasksPanel from './components/RecurringTasksPanel';
import './App.css';

const App: React.FC = () => {
  const [view, setView] = useState<'all' | 'active' | 'completed' | 'recurring'>('all');
  const [showForm, setShowForm] = useState(false);

  const { loading, error, data, refetch } = useQuery(
    view === 'all' ? GET_TASKS : GET_TASKS_BY_STATUS,
    { 
      variables: view !== 'all' ? { completed: view === 'completed' } : {},
      fetchPolicy: 'network-only'
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Task Manager</h1>
          <nav>
            <button 
              className={view === 'all' ? 'active' : ''} 
              onClick={() => setView('all')}
            >
              All Tasks
            </button>
            <button 
              className={view === 'active' ? 'active' : ''} 
              onClick={() => setView('active')}
            >
              Active
            </button>
            <button 
              className={view === 'completed' ? 'active' : ''} 
              onClick={() => setView('completed')}
            >
              Completed
            </button>
            <button 
              className={view === 'recurring' ? 'active' : ''} 
              onClick={() => setView('recurring')}
            >
              Recurring Tasks
            </button>
          </nav>
          <button 
            className="add-task-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Task'}
          </button>
        </header>

        <main>
          {showForm && (
            <TaskForm 
              onTaskAdded={() => {
                setShowForm(false);
                refetch();
              }}
            />
          )}

          <Routes>
            <Route path="/recurring" element={
              <RecurringTasksPanel onTaskCreated={() => refetch()} />
            } />
            <Route path="/" element={
              <TaskList 
                tasks={view === 'all' ? data?.tasks : data?.tasksByStatus} 
                onTaskUpdated={() => refetch()}
              />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;