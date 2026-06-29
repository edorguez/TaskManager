import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChecklistIcon from '@mui/icons-material/Checklist';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HelpIcon from '@mui/icons-material/Help';
import ArchiveIcon from '@mui/icons-material/Archive';

const mainNav = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Tasks', icon: <ChecklistIcon />, path: '/tasks' },
  { label: 'Analytics', icon: <BarChartIcon />, path: '#' },
  { label: 'Calendar', icon: <CalendarTodayIcon />, path: '#' },
];

const bottomNav = [
  { label: 'Help', icon: <HelpIcon />, path: '#' },
  { label: 'Archive', icon: <ArchiveIcon />, path: '#' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        height: '100%',
        borderRight: '4px solid #1b1c17',
        p: '16px',
        backgroundColor: '#fbf9f1',
        width: 256,
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Box
          component="h1"
          sx={{
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 800,
            fontSize: '20px',
            color: '#1b1c17',
            letterSpacing: '-0.02em',
          }}
        >
          TASK MANAGER
        </Box>
      </Box>

      <Box
        component="button"
        onClick={() => navigate('/tasks/new')}
        sx={{
          width: '100%',
          backgroundColor: '#f3ff00',
          color: '#1b1c17',
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 800,
          fontSize: '14px',
          border: '4px solid #1b1c17',
          boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
          py: 2,
          mb: 3,
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          '&:hover': {
            transform: 'translate(2px, 2px)',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          },
          '&:active': { transform: 'scale(0.95)' },
        }}
      >
        NEW TASK
      </Box>

      <Box component="nav" sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {mainNav.map((item) => {
          const isActive = item.path !== '#' && location.pathname === item.path;
          return (
            <Box
              key={item.label}
              component="a"
              onClick={() => item.path !== '#' && navigate(item.path)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                cursor: item.path !== '#' ? 'pointer' : 'default',
                fontFamily: '"Space Mono", monospace',
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                color: isActive ? '#007128' : '#474832',
                backgroundColor: isActive ? '#00fe66' : 'transparent',
                border: isActive ? '2px solid #1b1c17' : '2px solid transparent',
                boxShadow: isActive ? '4px 4px 0px 0px rgba(0,0,0,1)' : 'none',
                transition: 'all 0.15s ease',
                '&:hover': {
                  border: '2px solid #1b1c17',
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                  backgroundColor: item.path === '#' ? '#e4e3db' : isActive ? '#00fe66' : '#e4e3db',
                },
                '&:active': { transform: 'scale(0.95)' },
              }}
            >
              {item.icon}
              {item.label}
            </Box>
          );
        })}
      </Box>

      <Box sx={{ mt: 'auto', pt: 2, borderTop: '4px solid #1b1c17', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {bottomNav.map((item) => (
          <Box
            key={item.label}
            component="a"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              fontFamily: '"Space Mono", monospace',
              fontWeight: 700,
              fontSize: '14px',
              textTransform: 'uppercase',
              color: '#474832',
              cursor: 'default',
              transition: 'all 0.15s ease',
              '&:hover': {
                backgroundColor: '#e4e3db',
              },
            }}
          >
            {item.icon}
            {item.label}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
