import type { ReactNode } from 'react';
import { Box, Backdrop } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface NeoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function NeoModal({ open, onClose, title, description, icon, action }: NeoModalProps) {
  if (!open) return null;
  return (
    <Backdrop
      open={open}
      onClick={onClose}
      sx={{
        backgroundColor: 'rgba(27,28,23,0.4)',
        backdropFilter: 'blur(4px)',
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          backgroundColor: '#6bff83',
          border: '6px solid #1b1c17',
          boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)',
          p: '32px',
          maxWidth: 360,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Box sx={{ mb: 2 }}>
          {icon || <CheckCircleIcon sx={{ fontSize: 64, color: '#1b1c17' }} />}
        </Box>
        <Box
          component="h2"
          sx={{
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 800,
            fontSize: '24px',
            mb: 1,
            color: '#1b1c17',
          }}
        >
          {title}
        </Box>
        <Box
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            mb: 3,
            color: '#1b1c17',
          }}
        >
          {description}
        </Box>
        {action}
      </Box>
    </Backdrop>
  );
}

interface NeoConfirmButtonProps {
  onClick: () => void;
  label?: string;
}

export function NeoConfirmButton({ onClick, label = 'Acknowledged' }: NeoConfirmButtonProps) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        width: '100%',
        py: 2,
        border: '4px solid #1b1c17',
        backgroundColor: '#ffffff',
        fontFamily: '"Space Mono", monospace',
        fontWeight: 700,
        fontSize: '14px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
        transition: 'all 0.15s ease',
        '&:hover': {
          transform: 'translate(2px, 2px)',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
        '&:active': {
          transform: 'translate(4px, 4px)',
          boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)',
        },
      }}
    >
      {label}
    </Box>
  );
}
