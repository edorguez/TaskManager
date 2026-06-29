import { useEffect, useState } from 'react';
import { Box, Alert, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { NeoModal, NeoConfirmButton } from '../components/ui/NeoModal';
import { Board } from '../components/board/Board';
import { useTaskStore } from '../store/taskStore';

export default function TaskListPage() {
  const { tasks, statuses, loading, fetchTasks, fetchStatuses, deleteTask, updateTask } = useTaskStore();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchTasks();
    fetchStatuses();
  }, [fetchTasks, fetchStatuses]);

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      setSnackbar({ open: true, message: 'Task deleted successfully', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete task', severity: 'error' });
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleStatusChange = async (taskId: string, statusId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    try {
      await updateTask(taskId, {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        statusId,
      });
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box
          component="h1"
          sx={{
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 900,
            fontSize: { xs: '40px', md: '64px' },
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            color: '#1b1c17',
            mb: 2,
          }}
        >
          Task List
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ fontFamily: '"Space Grotesk", sans-serif', color: '#474832', py: 4, textAlign: 'center' }}>
          Loading tasks…
        </Box>
      ) : (
        <Board
          tasks={tasks}
          statuses={statuses}
          onDelete={(id) => setDeleteConfirmId(id)}
          onStatusChange={handleStatusChange}
        />
      )}

      <NeoModal
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="DELETE TASK"
        description="Are you sure you want to delete this task? This action cannot be undone."
        icon={<DeleteIcon sx={{ fontSize: 64, color: '#ba1a1a' }} />}
        action={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <NeoConfirmButton
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              label="Yes, Delete"
            />
            <Box
              component="button"
              onClick={() => setDeleteConfirmId(null)}
              sx={{
                flex: 1,
                py: 2,
                border: '4px solid #1b1c17',
                backgroundColor: '#e4e3db',
                fontFamily: '"Space Mono", monospace',
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                transition: 'all 0.15s ease',
                '&:hover': {
                  transform: 'translate(2px, 2px)',
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                },
                '&:active': {
                  transform: 'translate(4px, 4px)',
                  boxShadow: 'none',
                },
              }}
            >
              Cancel
            </Box>
          </Box>
        }
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ border: '4px solid #1b1c17', borderRadius: 0, boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
