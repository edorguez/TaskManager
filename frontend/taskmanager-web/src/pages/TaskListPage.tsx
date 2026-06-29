import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import PushPinIcon from '@mui/icons-material/PushPin';
import { StatusChip } from '../components/ui/NeoChip';
import { useTaskStore } from '../store/taskStore';

const filterOptions = ['All', 'Todo', 'InProgress', 'Done'];

function getTaskBgColor(status: string): string {
  if (status === 'InProgress') return '#f3ff00';
  return '#ffffff';
}

export default function TaskListPage() {
  const navigate = useNavigate();
  const { tasks, loading, fetchTasks } = useTaskStore();
  const [filter, setFilter] = useState('All');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = filter === 'All' ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '12fr' },
          gap: 4,
          mb: 4,
          alignItems: 'end',
        }}
      >
        <Box sx={{ gridColumn: { md: 'span 8' } }}>
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
            Sprint Alpha 04
          </Box>
          <Box
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 500,
              fontSize: '18px',
              color: '#474832',
              maxWidth: 600,
            }}
          >
            You have {tasks.length} active task{tasks.length !== 1 ? 's' : ''} in this workspace. Focus on the
            high-priority engineering requirements first.
          </Box>
        </Box>
        <Box
          sx={{
            gridColumn: { md: 'span 4' },
            display: 'flex',
            justifyContent: { md: 'flex-end' },
          }}
        >
          <Box
            sx={{
              backgroundColor: '#f3ff00',
              p: 3,
              border: '4px solid #1b1c17',
              boxShadow: '10px 10px 0px 0px rgba(0,0,0,1)',
              rotate: '2deg',
            }}
          >
            <Box
              sx={{
                fontFamily: '"Space Mono", monospace',
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                mb: 0.5,
                color: '#1b1c17',
              }}
            >
              Completion Rate
            </Box>
            <Box
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                color: '#1b1c17',
              }}
            >
              {tasks.length > 0
                ? Math.round((tasks.filter((t) => t.status === 'Done').length / tasks.length) * 100)
                : 0}
              %
            </Box>
          </Box>
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
          Loading tasks...
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
              sx={{
                backgroundColor: getTaskBgColor(task.status),
                border: '4px solid #1b1c17',
                boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
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
                    sx={{
                      width: 32,
                      height: 32,
                      border: '2px solid #1b1c17',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#e4e3db',
                      transition: 'background-color 0.2s ease',
                      '&:hover': { backgroundColor: '#f3ff00' },
                    }}
                  >
                    <PushPinIcon sx={{ fontSize: 16 }} />
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

                <Box sx={{ borderTop: '4px solid #1b1c17', mb: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon sx={{ fontSize: 16, color: '#1b1c17' }} />
                  <Box
                    sx={{
                      fontFamily: '"Space Mono", monospace',
                      fontWeight: 700,
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      color: '#1b1c17',
                    }}
                  >
                    Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  backgroundColor: task.status === 'InProgress' ? '#1b1c17' : '#e4e3db',
                  p: 2,
                  borderTop: '4px solid #1b1c17',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex' }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      border: '2px solid #1b1c17',
                      backgroundColor: '#6bff83',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 14 }} />
                  </Box>
                </Box>
                <Box
                  sx={{
                    fontFamily: '"Space Mono", monospace',
                    fontWeight: 700,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    opacity: 0.6,
                    color: task.status === 'InProgress' ? '#ffffff' : '#1b1c17',
                  }}
                >
                  ID: #KT-{task.id.slice(0, 3).toUpperCase()}
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
              Add New Segment
            </Box>
          </Box>
        </Box>
      )}

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
