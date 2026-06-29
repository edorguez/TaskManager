import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Stack,
} from '@mui/material';
import type { TaskStatus } from '../types';

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  statusId: number;
}

interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  statuses: TaskStatus[];
  onSubmit: (data: TaskFormData) => Promise<void>;
  isEdit?: boolean;
}

export default function TaskForm({ initialData, statuses, onSubmit, isEdit }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    dueDate: initialData?.dueDate?.split('T')[0] || '',
    statusId: initialData?.statusId || 1,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
      <Stack spacing={3}>
        <TextField
          label="Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <TextField
          label="Description"
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <TextField
          label="Due Date"
          type="date"
          required
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        {isEdit && (
          <TextField
            label="Status"
            select
            value={formData.statusId}
            onChange={(e) => setFormData({ ...formData, statusId: Number(e.target.value) })}
          >
            {statuses.map((status) => (
              <MenuItem key={status.id} value={status.id}>
                {status.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        <Button type="submit" variant="contained" disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
        </Button>
      </Stack>
    </Box>
  );
}
