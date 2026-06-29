import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Link,
  Alert,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      if (response.data.success && response.data.data) {
        login(response.data.data.token, { email: response.data.data.email });
        navigate('/');
      } else {
        setError(response.data.errors?.[0] || 'Login failed');
      }
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fbf9f1',
        backgroundImage: 'linear-gradient(#e4e3db 4px, transparent 4px), linear-gradient(90deg, #e4e3db 4px, transparent 4px)',
        backgroundSize: '60px 60px',
        p: '24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Space Grotesk", sans-serif',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: 128,
          height: 128,
          backgroundColor: '#00fe66',
          border: '4px solid #1b1c17',
          top: 40,
          left: 40,
          rotate: '12deg',
          opacity: 0.4,
          display: { xs: 'none', md: 'block' },
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 192,
          height: 48,
          backgroundColor: '#dae1ff',
          border: '4px solid #1b1c17',
          bottom: 80,
          right: 40,
          rotate: '-6deg',
          opacity: 0.4,
          display: { xs: 'none', md: 'block' },
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: '#c5cf00',
          border: '4px solid #1b1c17',
          top: '25%',
          right: '25%',
          opacity: 0.4,
          display: { xs: 'none', md: 'block' },
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 448,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            component="h1"
            sx={{
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 900,
              fontSize: { xs: '40px', md: '64px' },
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: '#1b1c17',
              lineHeight: 1.1,
            }}
          >
            TASK
            <br />
            MANAGER
          </Box>
        </Box>

        <Box
          sx={{
            border: '4px solid #1b1c17',
            backgroundColor: '#ffffff',
            boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)',
            p: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <Box sx={{ mb: 1 }}>
            <Box
              component="h2"
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 800,
                fontSize: '32px',
                textTransform: 'uppercase',
                color: '#1b1c17',
              }}
            >
              Login
            </Box>
            <Box sx={{ width: 64, height: 4, backgroundColor: '#1b1c17', mt: 1 }} />
          </Box>

          {error && (
            <Alert severity="error" sx={{ border: '4px solid #1b1c17', borderRadius: 0, boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box
                component="label"
                htmlFor="email"
                sx={{
                  fontFamily: '"Space Mono", monospace',
                  fontWeight: 700,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  color: '#1b1c17',
                }}
              >
                Identity / Email
              </Box>
              <Box sx={{ position: 'relative' }}>
                <EmailIcon
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#1b1c17',
                  }}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="USER@DOMAIN.COM"
                  required
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    border: '4px solid #1b1c17',
                    fontFamily: '"Space Mono", monospace',
                    fontSize: '14px',
                    color: '#1b1c17',
                    backgroundColor: '#ffffff',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = '#f3ff00';
                    e.target.style.boxShadow = '6px 6px 0px 0px rgba(0,0,0,1)';
                    e.target.style.transform = 'translate(-2px, -2px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'none';
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box
                component="label"
                htmlFor="password"
                sx={{
                  fontFamily: '"Space Mono", monospace',
                  fontWeight: 700,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  color: '#1b1c17',
                }}
              >
                Secret / Password
              </Box>
              <Box sx={{ position: 'relative' }}>
                <LockIcon
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#1b1c17',
                  }}
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    border: '4px solid #1b1c17',
                    fontFamily: '"Space Mono", monospace',
                    fontSize: '14px',
                    color: '#1b1c17',
                    backgroundColor: '#ffffff',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = '#f3ff00';
                    e.target.style.boxShadow = '6px 6px 0px 0px rgba(0,0,0,1)';
                    e.target.style.transform = 'translate(-2px, -2px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'none';
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Box
                component="label"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
              >
                <input type="checkbox" style={{ display: 'none' }} />
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    border: '4px solid #1b1c17',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ color: '#1b1c17', fontFamily: '"Space Mono", monospace', fontWeight: 700 }}>✓</Box>
                </Box>
                <Box
                  component="span"
                  sx={{ fontFamily: '"Space Mono", monospace', fontSize: '14px', textTransform: 'uppercase' }}
                >
                  Remember
                </Box>
              </Box>
              <Link
                href="#"
                sx={{
                  fontFamily: '"Space Mono", monospace',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  color: '#1b1c17',
                  textDecoration: 'underline',
                  '&:hover': { color: '#5e6300' },
                }}
              >
                Recover?
              </Link>
            </Box>

            <Box
              component="button"
              type="submit"
              disabled={loading}
              sx={{
                width: '100%',
                py: 2.5,
                border: '4px solid #1b1c17',
                backgroundColor: '#00fe66',
                color: '#007128',
                fontFamily: '"Space Mono", monospace',
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                transition: 'all 0.1s ease',
                '&:hover': {
                  transform: 'translate(2px, 2px)',
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                },
                '&:active': {
                  transform: 'translate(6px, 6px)',
                  boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)',
                },
                '&:disabled': {
                  opacity: 0.6,
                  cursor: 'not-allowed',
                },
              }}
            >
              {loading ? 'SIGNING IN...' : 'LOG IN'}
              <ArrowForwardIcon />
            </Box>
          </Box>

          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: '4px solid #1b1c17',
              textAlign: 'center',
            }}
          >
            <Box
              component="p"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                color: '#1b1c17',
              }}
            >
              Don&apos;t have an account?
            </Box>
            <Link
              component={RouterLink}
              to="/register"
              sx={{
                display: 'inline-block',
                mt: 1,
                backgroundColor: '#f3ff00',
                border: '4px solid #1b1c17',
                px: 4,
                py: 1.5,
                fontFamily: '"Space Mono", monospace',
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                color: '#1b1c17',
                boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                '&:hover': {
                  transform: 'translate(2px, 2px)',
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                },
              }}
            >
              Register
            </Link>
          </Box>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box
            sx={{
              border: '2px solid #1b1c17',
              px: 2,
              py: 0.5,
              fontFamily: '"Space Mono", monospace',
              fontSize: '12px',
              backgroundColor: '#b3c5ff',
              textTransform: 'uppercase',
              color: '#1b1c17',
            }}
          >
            SYSTEM: ACTIVE
          </Box>
          <Box
            sx={{
              border: '2px solid #1b1c17',
              px: 2,
              py: 0.5,
              fontFamily: '"Space Mono", monospace',
              fontSize: '12px',
              backgroundColor: '#ffdad6',
              textTransform: 'uppercase',
              color: '#1b1c17',
            }}
          >
            V3.4.0-BETA
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
