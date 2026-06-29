import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeIcon from '@mui/icons-material/Code';
import BrushIcon from '@mui/icons-material/Brush';
import StorageIcon from '@mui/icons-material/Storage';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import { StatCard } from '../components/ui/StatCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useTaskStore } from '../store/taskStore';

function getPriorityColor(status: string) {
  const s = status.toLowerCase();
  if (s.includes('high')) return '#ba1a1a';
  if (s.includes('mid')) return '#0054d6';
  return '#006e27';
}

function getPriorityLabel(status: string) {
  const s = status.toLowerCase();
  if (s.includes('high')) return 'HIGH';
  if (s.includes('mid')) return 'MID';
  return 'LOW';
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const todoCount = tasks.filter((t) => t.status === 'Todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'InProgress').length;
  const doneCount = tasks.filter((t) => t.status === 'Done').length;

  const recentTasks = tasks.slice(0, 3);

  const taskIcons = [<CodeIcon key="1" />, <BrushIcon key="2" />, <StorageIcon key="3" />];
  const taskBgColors = ['#dae1ff', '#6bff83', '#e1ec00'];

  const dummyAvatars = ['#00fe66', '#f3ff00', '#0054d6'];

  return (
    <Box>
      <SectionHeader
        title="System Overview"
        subtitle="Welcome back, Captain. Productivity is at 84%."
        badge={
          <Box
            sx={{
              backgroundColor: '#dae1ff',
              border: '4px solid #1b1c17',
              p: '8px 16px',
              boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
              fontFamily: '"Space Mono", monospace',
              fontWeight: 700,
              fontSize: '14px',
              textTransform: 'uppercase',
              color: '#1b1c17',
            }}
          >
            Sprint 12: Active
          </Box>
        }
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
          trend="+5 from yesterday"
        />
        <StatCard
          label="In Progress"
          value={inProgressCount}
          icon={<SyncIcon />}
          trend="Priority focused"
          bgColor="#f3ff00"
        />
        <StatCard
          label="Completed"
          value={doneCount}
          icon={<CheckCircleIcon />}
          trend="Weekly goal reached"
          bgColor="#00fe66"
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: '24px',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#ffffff',
            border: '4px solid #1b1c17',
            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        backgroundColor: getPriorityColor('mid'),
                        color: '#ffffff',
                        fontFamily: '"Space Mono", monospace',
                        fontWeight: 700,
                        fontSize: '12px',
                        px: 1.5,
                        py: 0.5,
                        border: '2px solid #1b1c17',
                      }}
                    >
                      {getPriorityLabel('mid')}
                    </Box>
                    <MoreVertIcon sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.1)' }, transition: 'transform 0.15s' }} />
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Box
            sx={{
              backgroundColor: '#ffffff',
              border: '4px solid #1b1c17',
              boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
              p: '16px',
              flex: 1,
            }}
          >
            <Box
              component="h3"
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                textTransform: 'uppercase',
                mb: 3,
                color: '#1b1c17',
              }}
            >
              Velocity
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: 192,
                gap: 1.5,
                px: 1,
              }}
            >
              {[
                { day: 'M', h: '60%', bg: '#5e6300' },
                { day: 'T', h: '85%', bg: '#006e27' },
                { day: 'W', h: '45%', bg: '#0054d6' },
                { day: 'T', h: '70%', bg: '#ba1a1a' },
                { day: 'F', h: '100%', bg: '#f3ff00' },
              ].map((bar, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    backgroundColor: bar.bg,
                    border: '4px solid #1b1c17',
                    height: bar.h,
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    cursor: 'help',
                    '&:hover': {
                      height: `calc(${bar.h} + 10%)`,
                    },
                  }}
                />
              ))}
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 2,
                fontFamily: '"Space Mono", monospace',
                fontSize: '10px',
                color: '#474832',
                textTransform: 'uppercase',
                borderTop: '2px solid #1b1c17',
                pt: 1,
              }}
            >
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span>
            </Box>
          </Box>

          <Box
            sx={{
              backgroundColor: '#e1ec00',
              border: '4px solid #1b1c17',
              boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
              p: '16px',
            }}
          >
            <Box
              component="h3"
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                textTransform: 'uppercase',
                mb: 2,
                color: '#1b1c17',
              }}
            >
              On Duty
            </Box>
            <Box sx={{ display: 'flex' }}>
              {dummyAvatars.map((bg, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '4px solid #1b1c17',
                    backgroundColor: bg,
                    ml: i > 0 ? -1.5 : 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"Space Mono", monospace',
                    fontWeight: 700,
                    fontSize: '12px',
                    color: '#1b1c17',
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </Box>
              ))}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '4px solid #1b1c17',
                  backgroundColor: '#1b1c17',
                  color: '#ffffff',
                  ml: -1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: '"Space Mono", monospace',
                  fontWeight: 700,
                  fontSize: '10px',
                }}
              >
                +4
              </Box>
            </Box>
            <Box
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                fontStyle: 'italic',
                mt: 2,
                color: '#1b1c17',
              }}
            >
              7 team members currently active.
            </Box>
          </Box>
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
