import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../store/authStore';

export default function TopNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      component="header"
      sx={{
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        px: '24px',
        height: 80,
        zIndex: 40,
        backgroundColor: '#fbf9f1',
        borderBottom: '4px solid #1b1c17',
        boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
        flexShrink: 0,
      }}
    >
      <Box
        component="button"
        onClick={handleLogout}
        sx={{
          display: 'flex',
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
  );
}
