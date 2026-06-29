import type { ReactNode } from 'react';
import { Box } from '@mui/material';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  badge?: ReactNode;
}

export function SectionHeader({ title, subtitle, action, badge }: SectionHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { md: 'flex-end' },
        justifyContent: 'space-between',
        gap: 2,
        mb: 4,
      }}
    >
      <Box>
        <Box
          component="h2"
          sx={{
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 800,
            fontSize: '32px',
            textTransform: 'uppercase',
            color: '#1b1c17',
            lineHeight: 1.2,
          }}
        >
          {title}
        </Box>
        {subtitle && (
          <Box
            component="p"
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 500,
              fontSize: '18px',
              color: '#474832',
              mt: 0.5,
            }}
          >
            {subtitle}
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {badge}
        {action}
      </Box>
    </Box>
  );
}
