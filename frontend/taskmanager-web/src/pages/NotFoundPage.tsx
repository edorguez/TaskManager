import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fbf9f1',
        p: 4,
        textAlign: 'center',
      }}
    >
      <Box
        component="h1"
        sx={{
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 900,
          fontSize: { xs: '80px', md: '128px' },
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          color: '#1b1c17',
          lineHeight: 1,
          mb: 2,
        }}
      >
        404
      </Box>
      <Box
        component="h2"
        sx={{
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 800,
          fontSize: '24px',
          textTransform: 'uppercase',
          color: '#1b1c17',
          mb: 2,
        }}
      >
        Page not found
      </Box>
      <Box
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 400,
          fontSize: '16px',
          color: '#474832',
          mb: 4,
          maxWidth: 400,
        }}
      >
        The page you're looking for doesn't exist or has been moved.
      </Box>
      <Box
        component="button"
        onClick={() => navigate('/')}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 6,
          py: 2,
          border: '4px solid #1b1c17',
          backgroundColor: '#f3ff00',
          color: '#6f7400',
          fontFamily: '"Space Mono", monospace',
          fontWeight: 700,
          fontSize: '14px',
          textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
          transition: 'all 0.15s ease',
          '&:hover': {
            transform: 'translate(2px, 2px)',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          },
          '&:active': {
            transform: 'translate(6px, 6px)',
            boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)',
          },
        }}
      >
        Go to Dashboard
        <ArrowForwardIcon />
      </Box>
    </Box>
  );
}
