import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import TaskForm from '../components/TaskForm';
import { useTaskStore } from '../store/taskStore';

export default function TaskCreatePage() {
  const navigate = useNavigate();
  const { statuses, fetchStatuses, createTask } = useTaskStore();

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  const handleSubmit = async (data: { title: string; description: string; dueDate: string; statusId: number }) => {
    await createTask({
      title: data.title,
      description: data.description,
      dueDate: new Date(data.dueDate).toISOString(),
    });
    navigate('/tasks');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Create Task</Typography>
      <TaskForm statuses={statuses} onSubmit={handleSubmit} />
    </Box>
  );
}
