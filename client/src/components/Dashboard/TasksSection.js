import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const TasksSection = ({ clientId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/api/tasks/${clientId}`);
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [clientId]);

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="tasks-section">
      <h3>Tasks & Deadlines</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Status: {task.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksSection;
