import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  Paper,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTaskStore } from '../store/taskStore';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const todoCount = tasks.filter((t) => t.status === 'Todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'InProgress').length;
  const doneCount = tasks.filter((t) => t.status === 'Done').length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/tasks/new')}>
          New Task
        </Button>
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="text.secondary">{todoCount}</Typography>
            <Typography variant="body1" color="text.secondary">Todo</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary.main">{inProgressCount}</Typography>
            <Typography variant="body1" color="text.secondary">In Progress</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="success.main">{doneCount}</Typography>
            <Typography variant="body1" color="text.secondary">Done</Typography>
          </Paper>
        </Grid>
      </Grid>
      {tasks.length > 0 && (
        <Paper sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom>Recent Tasks</Typography>
          {tasks.slice(0, 5).map((task) => (
            <Box
              key={task.id}
              sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider', cursor: 'pointer' }}
              onClick={() => navigate(`/tasks/${task.id}/edit`)}
            >
              <Typography>{task.title}</Typography>
              <Typography variant="body2" color="text.secondary">{task.status}</Typography>
            </Box>
          ))}
          {tasks.length > 5 && (
            <Button sx={{ mt: 1 }} onClick={() => navigate('/tasks')}>
              View all tasks
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
}
