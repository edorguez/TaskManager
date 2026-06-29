import { Button, styled } from '@mui/material';

export const NeoButton = styled(Button)(() => ({
  border: '4px solid #1b1c17',
  borderRadius: 0,
  boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
  textTransform: 'uppercase',
  fontFamily: '"Space Mono", monospace',
  fontWeight: 700,
  fontSize: '14px',
  letterSpacing: '0.05em',
  padding: '12px 24px',
  transition: 'all 0.15s ease',
  '&:hover': {
    transform: 'translate(2px, 2px)',
    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
  },
  '&:active': {
    transform: 'translate(4px, 4px)',
    boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)',
  },
}));

export const NeoPrimaryButton = styled(NeoButton)(() => ({
  backgroundColor: '#f3ff00',
  color: '#6f7400',
  '&:hover': { backgroundColor: '#f3ff00' },
}));

export const NeoSecondaryButton = styled(NeoButton)(() => ({
  backgroundColor: '#00fe66',
  color: '#007128',
  '&:hover': { backgroundColor: '#00fe66' },
}));

export const NeoErrorButton = styled(NeoButton)(() => ({
  backgroundColor: '#ba1a1a',
  color: '#ffffff',
  '&:hover': { backgroundColor: '#ba1a1a' },
}));
