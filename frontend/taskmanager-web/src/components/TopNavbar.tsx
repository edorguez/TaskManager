import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { SearchBar } from './ui/SearchBar';
import { useAuthStore } from '../store/authStore';

export default function TopNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        px: '24px',
        height: 80,
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: '#fbf9f1',
        borderBottom: '4px solid #1b1c17',
        boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Box
          onClick={() => navigate('/')}
          sx={{
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 800,
            fontSize: '24px',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            color: '#1b1c17',
            cursor: 'pointer',
          }}
        >
          TASK MANAGER
        </Box>
        <Box sx={{ display: { xs: 'none', lg: 'flex' } }}>
          <SearchBar />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          component="button"
          sx={{
            display: 'flex',
            p: 1,
            border: '2px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            color: '#1b1c17',
            transition: 'all 0.15s ease',
            '&:hover': {
              border: '2px solid #1b1c17',
              transform: 'translate(1px, 1px)',
              boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)',
            },
          }}
        >
          <NotificationsIcon />
        </Box>
        <Box
          component="button"
          sx={{
            display: 'flex',
            p: 1,
            border: '2px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            color: '#1b1c17',
            transition: 'all 0.15s ease',
            '&:hover': {
              border: '2px solid #1b1c17',
              transform: 'translate(1px, 1px)',
              boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)',
            },
          }}
        >
          <SettingsIcon />
        </Box>
        <Box
          sx={{
            width: 40,
            height: 40,
            border: '2px solid #1b1c17',
            boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)',
            backgroundColor: '#5e6300',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontFamily: '"Space Mono", monospace',
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </Box>
        <Box
          component="button"
          onClick={handleLogout}
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1,
            px: 3,
            py: 1.5,
            border: '4px solid #1b1c17',
            backgroundColor: '#ba1a1a',
            color: '#ffffff',
            fontFamily: '"Space Mono", monospace',
            fontWeight: 700,
            fontSize: '14px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
            transition: 'all 0.15s ease',
            '&:hover': {
              transform: 'translate(2px, 2px)',
              boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)',
            },
            '&:active': {
              transform: 'translate(4px, 4px)',
              boxShadow: 'none',
            },
          }}
        >
          <LogoutIcon sx={{ fontSize: 18 }} />
          LOGOUT
        </Box>
      </Box>
    </Box>
  );
}
