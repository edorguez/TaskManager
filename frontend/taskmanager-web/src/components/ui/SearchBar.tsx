import { Box, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
}

export function SearchBar({ placeholder = 'SEARCH TASKS...', value, onChange }: SearchBarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        border: '2px solid #1b1c17',
        px: 2,
        py: 0.75,
        gap: 1,
      }}
    >
      <SearchIcon sx={{ color: '#1b1c17', fontSize: 20 }} />
      <InputBase
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        sx={{
          fontFamily: '"Space Mono", monospace',
          fontSize: '14px',
          color: '#1b1c17',
          textTransform: 'uppercase',
          width: 256,
          '& .MuiInputBase-input': { p: 0 },
          '&::placeholder': { color: '#c8c8ab', opacity: 1 },
        }}
      />
    </Box>
  );
}
