import { Card, styled } from '@mui/material';

export const NeoCard = styled(Card)(() => ({
  border: '4px solid #1b1c17',
  borderRadius: 0,
  boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translate(2px, 2px)',
    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
  },
}));
