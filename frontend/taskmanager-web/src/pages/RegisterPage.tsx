import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Link, Alert } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.register(email, password, confirmPassword);
      if (response.data.success && response.data.data) {
        login(response.data.data.token, { email: response.data.data.email });
        navigate('/');
      } else {
        setError(response.data.errors?.[0] || 'Registration failed');
      }
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    width: '100%',
    padding: '16px 16px 16px 48px',
    border: '4px solid #1b1c17',
    fontFamily: '"Space Mono", monospace',
    fontSize: '14px',
    color: '#1b1c17',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.backgroundColor = '#f3ff00';
    e.target.style.boxShadow = '8px 8px 0px 0px rgba(0,0,0,1)';
    e.target.style.transform = 'translate(-2px, -2px)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.backgroundColor = '#ffffff';
    e.target.style.boxShadow = 'none';
    e.target.style.transform = 'none';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fbf9f1',
        backgroundImage:
          'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
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
          backgroundColor: '#6bff83',
          border: '4px solid #1b1c17',
          top: 40,
          left: 40,
          rotate: '12deg',
          opacity: 0.4,
          display: { xs: 'none', md: 'block' },
          zIndex: 0,
          boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
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
          boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
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
          boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 512,
        }}
      >
        <Box
          sx={{
            border: '4px solid #1b1c17',
            backgroundColor: '#ffffff',
            boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)',
            p: { xs: '24px', md: '48px' },
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              component="h1"
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 900,
                fontSize: { xs: '24px', md: '32px' },
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                color: '#1b1c17',
                mb: 1,
              }}
            >
              TASK MANAGER
            </Box>
            <Box
              sx={{
                display: 'inline-block',
                backgroundColor: '#f3ff00',
                border: '2px solid #1b1c17',
                px: 2,
                py: 0.5,
                fontFamily: '"Space Mono", monospace',
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                color: '#1b1c17',
              }}
            >
              New Operative Enrollment
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, border: '4px solid #1b1c17', borderRadius: 0, boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box
                component="label"
                htmlFor="fullname"
                sx={{
                  fontFamily: '"Space Mono", monospace',
                  fontWeight: 700,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  color: '#1b1c17',
                }}
              >
                Full Name
              </Box>
              <Box sx={{ position: 'relative' }}>
                <PersonIcon
                  sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#1b1c17' }}
                />
                <input
                  id="fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="COMMANDER SHEPARD"
                  style={inputStyles}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </Box>
            </Box>

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
                  sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#1b1c17' }}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="USER@EXAMPLE.COM"
                  required
                  style={inputStyles}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '16px' }}>
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
                  Secret
                </Box>
                <Box sx={{ position: 'relative' }}>
                  <LockIcon
                    sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#1b1c17' }}
                  />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    required
                    style={inputStyles}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box
                  component="label"
                  htmlFor="confirm-password"
                  sx={{
                    fontFamily: '"Space Mono", monospace',
                    fontWeight: 700,
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    color: '#1b1c17',
                  }}
                >
                  Verify Secret
                </Box>
                <Box sx={{ position: 'relative' }}>
                  <LockIcon
                    sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#1b1c17' }}
                  />
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="********"
                    required
                    style={inputStyles}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </Box>
              </Box>
            </Box>

            <Box
              component="button"
              type="submit"
              disabled={loading}
              sx={{
                width: '100%',
                py: 3,
                border: '4px solid #1b1c17',
                backgroundColor: '#f3ff00',
                color: '#6f7400',
                fontFamily: '"Space Mono", monospace',
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                transition: 'all 0.15s ease',
                '&:hover': {
                  transform: 'translate(4px, 4px)',
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                },
                '&:active': {
                  transform: 'translate(8px, 8px)',
                  boxShadow: 'none',
                },
                '&:disabled': {
                  opacity: 0.6,
                  cursor: 'not-allowed',
                },
              }}
            >
              {loading ? 'REGISTERING...' : 'Register'}
              <ArrowForwardIcon
                sx={{
                  fontWeight: 700,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'rotate(45deg)' },
                }}
              />
            </Box>

            <Box
              sx={{
                textAlign: 'center',
                pt: 2,
                borderTop: '4px solid #1b1c17',
              }}
            >
              <Box
                component="p"
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  mb: 1,
                  color: '#1b1c17',
                }}
              >
                ALREADY DEPLOYED?
              </Box>
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  display: 'inline-block',
                  backgroundColor: '#e4e3db',
                  border: '2px solid #1b1c17',
                  px: 3,
                  py: 1.5,
                  fontFamily: '"Space Mono", monospace',
                  fontWeight: 700,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  color: '#1b1c17',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  '&:hover': { backgroundColor: '#6bff83' },
                }}
              >
                Log in to Dashboard
              </Link>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
            fontFamily: '"Space Mono", monospace',
            fontSize: '12px',
            textTransform: 'uppercase',
            opacity: 0.7,
            color: '#1b1c17',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: '#00fe66',
                border: '1px solid #1b1c17',
                animation: 'pulse 2s infinite',
              }}
            />
            Uplink Established
          </Box>
          <Box>VER: 2.0.4-KT</Box>
        </Box>
      </Box>
    </Box>
  );
}
