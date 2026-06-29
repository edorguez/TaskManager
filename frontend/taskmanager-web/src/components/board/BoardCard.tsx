import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../../types';

interface BoardCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

export const BoardCard = memo(function BoardCard({ task, onDelete }: BoardCardProps) {
  const navigate = useNavigate();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'task', status: task.status },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/tasks/${task.id}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        backgroundColor: task.status === 'InProgress' ? '#f3ff00' : '#ffffff',
        border: '4px solid #1b1c17',
        boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'grab',
        '&:hover': {
          transform: 'translate(4px, 4px)',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      }}
    >
      <Box sx={{ p: { xs: 2, md: 3 }, flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Box
            component="h3"
            sx={{
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 800,
              fontSize: { xs: '20px', md: '24px' },
              textTransform: 'uppercase',
              lineHeight: 1.2,
              color: '#1b1c17',
            }}
          >
            {task.title}
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
            <Box
              component="button"
              onClick={handleEdit}
              sx={{
                display: 'flex',
                p: { xs: 1, md: 0.5 },
                border: '2px solid #1b1c17',
                backgroundColor: '#1b1c17',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': { backgroundColor: '#474832' },
              }}
            >
              <EditIcon sx={{ fontSize: 16 }} />
            </Box>
            <Box
              component="button"
              onClick={handleDelete}
              sx={{
                display: 'flex',
                p: { xs: 1, md: 0.5 },
                border: '2px solid #1b1c17',
                backgroundColor: '#ba1a1a',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': { backgroundColor: '#8a0f0f' },
              }}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 400,
            fontSize: { xs: '14px', md: '16px' },
            color: '#474832',
            opacity: 0.7,
            mt: 0.5,
          }}
        >
          {task.description || 'No description'}
        </Box>
      </Box>
    </Box>
  );
});
