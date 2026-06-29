import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { BoardCard } from './BoardCard';
import type { Task } from '../../types';

interface ColumnProps {
  id: string;
  title: string;
  statusId: number;
  tasks: Task[];
  onDelete: (id: string) => void;
}

const columnStyles: Record<string, { bg: string; headerBg: string; headerText: string }> = {
  Todo: { bg: '#f0eee6', headerBg: '#e4e3db', headerText: '#474832' },
  InProgress: { bg: '#f5f3ff', headerBg: '#dae1ff', headerText: '#003fa4' },
  Done: { bg: '#f0faf0', headerBg: '#6bff83', headerText: '#002107' },
};

export function Column({ id, title, statusId, tasks, onDelete }: ColumnProps) {
  const navigate = useNavigate();
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: 'column' },
  });

  const styles = columnStyles[id] || columnStyles.Todo;

  return (
    <Box
      ref={setNodeRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '4px solid #1b1c17',
        boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
        backgroundColor: styles.bg,
        minHeight: { xs: 'auto', md: '400px' },
        maxHeight: { xs: '380px', md: 'none' },
        flex: 1,
        outline: isOver ? '4px dashed #1b1c17' : 'none',
        outlineOffset: -2,
        transition: 'outline 0.2s ease',
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 1.5, md: 2 },
          borderBottom: '4px solid #1b1c17',
          backgroundColor: styles.headerBg,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            fontFamily: '"Space Mono", monospace',
            fontWeight: 700,
            fontSize: { xs: '16px', md: '14px' },
            textTransform: 'uppercase',
            color: styles.headerText,
          }}
        >
          {title}
        </Box>
        <Box
          sx={{
            fontFamily: '"Space Mono", monospace',
            fontWeight: 700,
            fontSize: { xs: '14px', md: '12px' },
            color: styles.headerText,
            border: '2px solid #1b1c17',
            px: 1.5,
            py: 0.5,
            backgroundColor: '#ffffff',
            lineHeight: 1,
          }}
        >
          {tasks.length}
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: { xs: 1.5, md: 2 },
          py: { xs: 1.5, md: 2 },
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          minHeight: 80,
        }}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <BoardCard key={task.id} task={task} onDelete={onDelete} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"Space Grotesk", sans-serif',
              color: '#474832',
              opacity: 0.4,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            No tasks yet
          </Box>
        )}
      </Box>

      <Box
        component="button"
        onClick={() => navigate('/tasks/new?statusId=' + statusId)}
        sx={{
          width: '100%',
          py: { xs: 2.5, md: 3 },
          border: 'none',
          borderTop: '4px dashed #1b1c17',
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 700,
          fontSize: { xs: '14px', md: '16px' },
          textTransform: 'uppercase',
          color: '#474832',
          '&:hover': {
            backgroundColor: '#ffffff',
            color: '#1b1c17',
          },
        }}
      >
        <AddIcon sx={{ fontSize: 18 }} />
        Add Task
      </Box>
    </Box>
  );
}
