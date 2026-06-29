import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import ChecklistIcon from '@mui/icons-material/Checklist';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../store/authStore';

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const items = [
    {
      label: 'Dash',
      icon: <DashboardIcon />,
      path: '/',
      active: location.pathname === '/',
    },
    {
      label: 'Tasks',
      icon: <ChecklistIcon />,
      path: '/tasks',
      active: location.pathname.startsWith('/tasks'),
    },
    {
      label: 'New',
      icon: <AddIcon />,
      path: '/tasks/new',
      active: false,
      isFab: true,
    },
    {
      label: 'Logout',
      icon: <LogoutIcon />,
      path: null,
      active: false,
      isLogout: true,
    },
  ];

  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: '#fbf9f1',
        borderTop: '4px solid #1b1c17',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 50,
      }}
    >
      {items.map((item) => {
        if (item.isFab) {
          return (
            <Box
              key={item.label}
              component="button"
              onClick={() => navigate(item.path!)}
              sx={{
                position: 'relative',
                top: -16,
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#f3ff00',
                border: '4px solid #1b1c17',
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:active': { transform: 'scale(0.95)' },
              }}
            >
              <AddIcon sx={{ fontSize: 32, fontWeight: 700, color: '#1b1c17' }} />
            </Box>
          );
        }

        if (item.isLogout) {
          return (
            <Box
              key={item.label}
              component="button"
              onClick={handleLogout}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#ba1a1a',
                fontFamily: '"Space Mono", monospace',
                fontSize: '10px',
                textTransform: 'uppercase',
              }}
            >
              <LogoutIcon />
              {item.label}
            </Box>
          );
        }

        return (
          <Box
            key={item.label}
            component="button"
            onClick={() => navigate(item.path!)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: item.active ? '#5e6300' : '#474832',
              fontFamily: '"Space Mono", monospace',
              fontSize: '10px',
              textTransform: 'uppercase',
              fontWeight: item.active ? 700 : 400,
            }}
          >
            {item.icon}
            {item.label}
          </Box>
        );
      })}
    </Box>
  );
}
