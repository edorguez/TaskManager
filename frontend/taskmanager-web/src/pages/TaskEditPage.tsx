import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import TaskForm from '../components/TaskForm';
import { useTaskStore } from '../store/taskStore';
import type { Task } from '../types';

export default function TaskEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { statuses, fetchStatuses, updateTask, getTaskById } = useTaskStore();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  useEffect(() => {
    if (id) {
      getTaskById(id).then((t) => {
        setTask(t);
        setLoading(false);
      });
    }
  }, [id, getTaskById]);

  const handleSubmit = async (data: { title: string; description: string; dueDate: string; statusId: number }) => {
    if (!id) return;
    await updateTask(id, {
      title: data.title,
      description: data.description,
      dueDate: new Date(data.dueDate).toISOString(),
      statusId: data.statusId,
    });
    navigate('/tasks');
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!task) return <Typography>Task not found</Typography>;

  const statusObj = statuses.find((s) => s.name === task.status);
  const initialData = {
    title: task.title,
    description: task.description,
    dueDate: task.dueDate.split('T')[0],
    statusId: statusObj?.id || 1,
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Edit Task</Typography>
      <TaskForm
        initialData={initialData}
        statuses={statuses}
        onSubmit={handleSubmit}
        isEdit
      />
    </Box>
  );
}
