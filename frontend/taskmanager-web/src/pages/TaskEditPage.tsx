import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import BoltIcon from '@mui/icons-material/Bolt';
import { NeoInput } from '../components/ui/NeoInput';
import { useTaskStore } from '../store/taskStore';
import type { Task } from '../types';

export default function TaskEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { statuses, fetchStatuses, updateTask, getTaskById } = useTaskStore();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [statusId, setStatusId] = useState(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  useEffect(() => {
    if (id) {
      getTaskById(id).then((t) => {
        if (t) {
          setTask(t);
          setTitle(t.title);
          setDescription(t.description);
          setDueDate(t.dueDate.split('T')[0]);
          const statusObj = statuses.find((s) => s.name === t.status);
          setStatusId(statusObj?.id || 1);
        }
        setLoading(false);
      });
    }
  }, [id, getTaskById, statuses]);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (title.trim().length > 200) {
      setError('Title must be at most 200 characters');
      return;
    }
    if (!dueDate) {
      setError('Due date is required');
      return;
    }
    setSubmitting(true);
    try {
      await updateTask(id, {
        title: title.trim(),
        description,
        dueDate: new Date(dueDate).toISOString(),
        statusId,
      });
      navigate('/tasks');
    } catch (err) {
      const data = (err as any)?.response?.data;
      setError(data?.errors?.[0] || 'Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ fontFamily: '"Space Grotesk", sans-serif', color: '#474832', py: 4, textAlign: 'center' }}>
        Loading...
      </Box>
    );
  }

  if (!task) {
    return (
      <Box sx={{ fontFamily: '"Space Grotesk", sans-serif', color: '#474832', py: 4, textAlign: 'center' }}>
        Task not found
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ maxWidth: 768, mx: 'auto', mt: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box
            component="button"
            onClick={() => navigate(-1)}
            sx={{
              display: 'flex',
              p: 1.5,
              border: '4px solid #1b1c17',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
              transition: 'all 0.15s ease',
              '&:active': { transform: 'translate(4px, 4px)', boxShadow: 'none' },
            }}
          >
            <ArrowBackIcon />
          </Box>
          <Box>
            <Box
              component="h1"
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 800,
                fontSize: '32px',
                textTransform: 'uppercase',
                fontStyle: 'italic',
                letterSpacing: '-0.02em',
                color: '#1b1c17',
              }}
            >
              Update Task
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: '#ffffff',
            border: '6px solid #1b1c17',
            boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)',
            p: { xs: '16px', md: '32px' },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 8, backgroundColor: '#1b1c17' }} />

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, border: '4px solid #1b1c17', borderRadius: 0, boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}>
                {error}
              </Alert>
            )}
            <Box>
              <NeoInput
                label="Task Title *"
                placeholder="ENTER A BOLD TITLE..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: '24px',
              }}
            >
              <Box>
                <Box
                  sx={{
                    fontFamily: '"Space Mono", monospace',
                    fontWeight: 700,
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#1b1c17',
                  }}
                >
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#0054d6', border: '2px solid #1b1c17', display: 'inline-block' }} />
                  Due Date *
                </Box>
                <Box sx={{ position: 'relative' }}>
                  <EventIcon
                    sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: '#1b1c17' }}
                  />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={today}
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 56px',
                      border: '4px solid #1b1c17',
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontSize: '18px',
                      color: '#1b1c17',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#f3ff00';
                      e.target.style.boxShadow = '8px 8px 0px 0px rgba(0,0,0,1)';
                      e.target.style.transform = 'translate(-2px, -2px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = '#ffffff';
                      e.target.style.boxShadow = '6px 6px 0px 0px rgba(0,0,0,1)';
                      e.target.style.transform = 'none';
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Box
                  sx={{
                    fontFamily: '"Space Mono", monospace',
                    fontWeight: 700,
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#1b1c17',
                  }}
                >
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#5e6300', border: '2px solid #1b1c17', display: 'inline-block' }} />
                  Status *
                </Box>
                <Box
                  component="select"
                  value={statusId}
                  onChange={(e) => setStatusId(Number(e.target.value))}
                  sx={{
                    width: '100%',
                    p: '16px',
                    border: '4px solid #1b1c17',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '16px',
                    color: '#1b1c17',
                    backgroundColor: '#ffffff',
                    boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                    outline: 'none',
                    borderRadius: 0,
                    transition: 'all 0.2s ease',
                    '&:focus': {
                      backgroundColor: '#f3ff00',
                      boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
                      transform: 'translate(-2px, -2px)',
                    },
                  }}
                >
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Box>
              </Box>
            </Box>

            <Box>
              <NeoInput
                label="Detailed Briefing"
                placeholder="UPDATE THE OBJECTIVES..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={6}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>

            <Box sx={{ borderTop: '4px solid #1b1c17', my: 2 }} />

            <Box
              component="button"
              type="submit"
              disabled={submitting}
              sx={{
                width: '100%',
                height: 80,
                backgroundColor: '#f3ff00',
                border: '6px solid #1b1c17',
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#6f7400',
                boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                transition: 'all 0.15s ease',
                '&:hover': {
                  transform: 'translate(4px, 4px)',
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                },
                '&:active': {
                  transform: 'translate(8px, 8px)',
                  boxShadow: 'none',
                },
                '&:disabled': {
                  opacity: 0.6,
                  cursor: 'not-allowed',
                },
              }}
            >
              {submitting ? 'UPDATING…' : 'UPDATE TASK'}
              <BoltIcon
                sx={{
                  fontSize: 40,
                  fontWeight: 700,
                  transition: 'transform 0.3s ease',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
