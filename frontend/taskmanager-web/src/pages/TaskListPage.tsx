import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { StatusChip } from '../components/ui/NeoChip';
import { NeoModal, NeoConfirmButton } from '../components/ui/NeoModal';
import { useTaskStore } from '../store/taskStore';

const filterOptions = ['All', 'Todo', 'InProgress', 'Done'];

function getTaskBgColor(status: string): string {
  if (status === 'InProgress') return '#f3ff00';
  return '#ffffff';
}

export default function TaskListPage() {
  const navigate = useNavigate();
  const { tasks, loading, fetchTasks, deleteTask } = useTaskStore();
  const [filter, setFilter] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = filter === 'All' ? tasks : tasks.filter((t) => t.status === filter);

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

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
        }}
      >
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

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 4,
          borderBottom: '4px solid #1b1c17',
          pb: 4,
        }}
      >
        {filterOptions.map((f) => (
          <Box
            key={f}
            component="button"
            onClick={() => setFilter(f)}
            sx={{
              px: 4,
              py: 1.5,
              fontFamily: '"Space Mono", monospace',
              fontWeight: 700,
              fontSize: '14px',
              textTransform: 'uppercase',
              border: '4px solid #1b1c17',
              cursor: 'pointer',
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
              transition: 'all 0.15s ease',
              backgroundColor: filter === f ? '#00fe66' : '#ffffff',
              color: filter === f ? '#007128' : '#474832',
              '&:hover': {
                transform: 'translate(2px, 2px)',
                boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)',
              },
            }}
          >
            {f === 'InProgress' ? 'In Progress' : f === 'All' ? 'All' : f}
          </Box>
        ))}
      </Box>

      {loading ? (
        <Box sx={{ fontFamily: '"Space Grotesk", sans-serif', color: '#474832', py: 4, textAlign: 'center' }}>
          Loading tasks…
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 4,
          }}
        >
          {filteredTasks.map((task) => (
            <Box
              key={task.id}
              onClick={() => navigate(`/tasks/${task.id}/edit`)}
              sx={{
                backgroundColor: getTaskBgColor(task.status),
                border: '4px solid #1b1c17',
                boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translate(4px, 4px)',
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                },
              }}
            >
              <Box sx={{ p: 3, flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <StatusChip status={task.status} />
                  <Box
                    component="button"
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(task.id); }}
                    sx={{
                      display: 'flex',
                      p: 0.5,
                      border: '2px solid #1b1c17',
                      backgroundColor: '#ba1a1a',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': { backgroundColor: '#8a0f0f' },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </Box>
                </Box>

                <Box
                  component="h3"
                  sx={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontWeight: 800,
                    fontSize: '24px',
                    textTransform: 'uppercase',
                    mb: 1,
                    lineHeight: 1.2,
                    color: '#1b1c17',
                  }}
                >
                  {task.title}
                </Box>

                <Box
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: '#474832',
                    mb: 3,
                    opacity: 0.7,
                  }}
                >
                  {task.description || 'No description'}
                </Box>

              </Box>
            </Box>
          ))}

          <Box
            component="button"
            onClick={() => navigate('/tasks/new')}
            sx={{
              border: '4px dashed #1b1c17',
              backgroundColor: '#f0eee6',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 6,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#ffffff',
                borderStyle: 'solid',
              },
            }}
          >
            <AddIcon sx={{ fontSize: 64, mb: 2, color: '#1b1c17', transition: 'transform 0.2s ease', '&:hover': { transform: 'scale(1.25)' } }} />
            <Box
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                textTransform: 'uppercase',
                color: '#1b1c17',
              }}
            >
              Add New Task
            </Box>
          </Box>
        </Box>
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
