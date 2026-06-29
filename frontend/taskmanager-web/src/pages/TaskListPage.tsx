import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskCard from '../components/TaskCard';
import { useTaskStore } from '../store/taskStore';

export default function TaskListPage() {
  const navigate = useNavigate();
  const { tasks, loading, fetchTasks, completeTask, deleteTask } = useTaskStore();
  const [filter, setFilter] = useState<string | null>('all');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  const handleComplete = async (id: string) => {
    try {
      await completeTask(id);
      setSnackbar({ open: true, message: 'Task completed!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to complete task', severity: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      setSnackbar({ open: true, message: 'Task deleted', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete task', severity: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Tasks</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/tasks/new')}>
          New Task
        </Button>
      </Box>

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(_, val) => setFilter(val)}
        size="small"
        sx={{ mb: 3 }}
      >
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="Todo">Todo</ToggleButton>
        <ToggleButton value="InProgress">In Progress</ToggleButton>
        <ToggleButton value="Done">Done</ToggleButton>
      </ToggleButtonGroup>

      {loading ? (
        <Typography>Loading tasks...</Typography>
      ) : filteredTasks.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No tasks found
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => navigate('/tasks/new')}>
            Create your first task
          </Button>
        </Box>
      ) : (
        filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
        ))
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
