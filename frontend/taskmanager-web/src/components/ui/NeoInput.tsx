import { TextField, styled } from '@mui/material';

export const NeoInput = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    border: '4px solid #1b1c17',
    borderRadius: 0,
    backgroundColor: '#ffffff',
    fontFamily: '"Space Grotesk", sans-serif',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    '& fieldset': { border: 'none' },
    '&:hover fieldset': { border: 'none' },
    '&.Mui-focused': {
      backgroundColor: '#f3ff00',
      boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
      transform: 'translate(-2px, -2px)',
    },
    '&.Mui-focused fieldset': { border: 'none' },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Space Mono", monospace',
    fontWeight: 700,
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#1b1c17',
    position: 'static',
    transform: 'none',
    marginBottom: '8px',
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#1b1c17' },
  '& .MuiOutlinedInput-input': { padding: '16px' },
}));
