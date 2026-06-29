import type { ReactNode } from 'react';
import { Box } from '@mui/material';

interface NeoBadgeProps {
  label: string;
  color?: 'high' | 'mid' | 'low' | 'default';
  icon?: ReactNode;
}

const colorMap = {
  high: { bg: '#ffdad6', text: '#93000a', border: '#1b1c17' },
  mid: { bg: '#dae1ff', text: '#003fa4', border: '#1b1c17' },
  low: { bg: '#6bff83', text: '#002107', border: '#1b1c17' },
  default: { bg: '#e4e3db', text: '#1b1c17', border: '#1b1c17' },
};

export function NeoBadge({ label, color = 'default', icon }: NeoBadgeProps) {
  const c = colorMap[color];
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        backgroundColor: c.bg,
        color: c.text,
        border: `2px solid ${c.border}`,
        fontFamily: '"Space Mono", monospace',
        fontWeight: 700,
        fontSize: '12px',
        textTransform: 'uppercase',
        px: 1.5,
        py: 0.5,
        lineHeight: 1,
      }}
    >
      {icon}
      {label}
    </Box>
  );
}

interface StatusChipProps {
  status: string;
}

const statusMap: Record<string, { bg: string; text: string }> = {
  Todo: { bg: '#e4e3db', text: '#474832' },
  InProgress: { bg: '#dae1ff', text: '#003fa4' },
  Done: { bg: '#6bff83', text: '#002107' },
};

export function StatusChip({ status }: StatusChipProps) {
  const s = statusMap[status] || statusMap.Todo;
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: s.bg,
        color: s.text,
        border: '2px solid #1b1c17',
        fontFamily: '"Space Mono", monospace',
        fontWeight: 700,
        fontSize: '12px',
        textTransform: 'uppercase',
        px: 1.5,
        py: 0.5,
      }}
    >
      {status === 'Todo' ? 'TODO' : status === 'InProgress' ? 'IN PROGRESS' : 'DONE'}
    </Box>
  );
}
