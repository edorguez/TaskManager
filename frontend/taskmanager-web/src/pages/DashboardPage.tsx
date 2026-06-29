import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeIcon from '@mui/icons-material/Code';
import BrushIcon from '@mui/icons-material/Brush';
import StorageIcon from '@mui/icons-material/Storage';
import AddIcon from '@mui/icons-material/Add';
import { StatCard } from '../components/ui/StatCard';
import { SectionHeader } from '../components/ui/SectionHeader';
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

  const recentTasks = tasks.slice(0, 5);

  const taskIcons = [<CodeIcon key="1" />, <BrushIcon key="2" />, <StorageIcon key="3" />];
  const taskBgColors = ['#dae1ff', '#6bff83', '#e1ec00'];

  return (
    <Box>
      <SectionHeader
        title="System Overview"
        subtitle="Welcome back, Captain."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: '24px',
          mb: 4,
        }}
      >
        <StatCard
          label="Total Tasks"
          value={todoCount + inProgressCount + doneCount || 0}
          icon={<TaskIcon />}
        />
        <StatCard
          label="In Progress"
          value={inProgressCount}
          icon={<SyncIcon />}
          bgColor="#f3ff00"
        />
        <StatCard
          label="Done"
          value={doneCount}
          icon={<CheckCircleIcon />}
          bgColor="#00fe66"
        />
      </Box>

      <Box
        sx={{
          backgroundColor: '#ffffff',
          border: '4px solid #1b1c17',
          boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
          mb: 4,
        }}
      >
        <Box
            sx={{
              p: 2,
              borderBottom: '4px solid #1b1c17',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#eae8e0',
            }}
          >
            <Box
              component="h3"
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                textTransform: 'uppercase',
                color: '#1b1c17',
              }}
            >
              Recent Tasks
            </Box>
            <Box
              component="button"
              onClick={() => navigate('/tasks')}
              sx={{
                fontFamily: '"Space Mono", monospace',
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                color: '#1b1c17',
                '&:hover': { textDecoration: 'none' },
              }}
            >
              VIEW ALL
            </Box>
          </Box>

          <Box sx={{ '& > * + *': { borderTop: '4px solid #1b1c17' } }}>
            {recentTasks.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', fontFamily: '"Space Grotesk", sans-serif', color: '#474832' }}>
                No tasks yet. Create your first task!
              </Box>
            ) : (
              recentTasks.map((task, i) => (
                <Box
                  key={task.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 3,
                    transition: 'background-color 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#e4e3db' },
                  }}
                  onClick={() => navigate(`/tasks/${task.id}/edit`)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '4px solid #1b1c17',
                        backgroundColor: taskBgColors[i % taskBgColors.length],
                        color: '#1b1c17',
                      }}
                    >
                      {taskIcons[i % taskIcons.length]}
                    </Box>
                    <Box>
                      <Box
                        sx={{
                          fontFamily: '"Montserrat", sans-serif',
                          fontWeight: 800,
                          fontSize: '16px',
                          textTransform: 'uppercase',
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
                        }}
                      >
                        {task.description?.slice(0, 40) || 'No description'} • {task.status}
                      </Box>
                    </Box>
                  </Box>

                </Box>
              ))
            )}
          </Box>
      </Box>

      <Box
        component="button"
        onClick={() => navigate('/tasks/new')}
        sx={{
          position: 'fixed',
          bottom: { xs: 96, md: '24px' },
          right: '24px',
          width: 64,
          height: 64,
          backgroundColor: '#f3ff00',
          border: '4px solid #1b1c17',
          boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 50,
          transition: 'all 0.15s ease',
          '&:hover': {
            transform: 'translate(2px, 2px)',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          },
          '&:active': { transform: 'scale(0.9)' },
        }}
      >
        <AddIcon sx={{ fontSize: 32, fontWeight: 700, color: '#1b1c17' }} />
      </Box>
    </Box>
  );
}
