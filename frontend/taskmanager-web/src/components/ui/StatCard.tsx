import type { ReactNode } from 'react';
import { Box } from '@mui/material';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  bgColor?: string;
}

export function StatCard({ label, value, icon, trend, bgColor = '#ffffff' }: StatCardProps) {
  return (
    <Box
      sx={{
        backgroundColor: bgColor,
        border: '4px solid #1b1c17',
        boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
        p: '16px',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translate(2px, 2px)',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box
          component="span"
          sx={{
            fontFamily: '"Space Mono", monospace',
            fontWeight: 700,
            fontSize: '14px',
            textTransform: 'uppercase',
            color: '#1b1c17',
          }}
        >
          {label}
        </Box>
        <Box
          sx={{
            backgroundColor: '#1b1c17',
            color: '#ffffff',
            display: 'flex',
            p: 0.5,
          }}
        >
          {icon}
        </Box>
      </Box>
      <Box
        component="div"
        sx={{
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 900,
          fontSize: '64px',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: '#1b1c17',
        }}
      >
        {value}
      </Box>
      {trend && (
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: '4px solid #1b1c17',
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            fontStyle: 'italic',
            color: '#474832',
          }}
        >
          {trend}
        </Box>
      )}
    </Box>
  );
}
