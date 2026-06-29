import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import BoltIcon from '@mui/icons-material/Bolt';
import { NeoInput } from '../components/ui/NeoInput';
import { NeoModal, NeoConfirmButton } from '../components/ui/NeoModal';
import { useTaskStore } from '../store/taskStore';

export default function TaskCreatePage() {
  const navigate = useNavigate();
  const { createTask } = useTaskStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('low');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTask({
        title,
        description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
      });
      setShowSuccess(true);
      setTitle('');
    } finally {
      setSubmitting(false);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low', bg: '#ffffff', checkedBg: '#f3ff00' },
    { value: 'med', label: 'Med', bg: '#ffffff', checkedBg: '#6bff83' },
    { value: 'high', label: 'High', bg: '#ffffff', checkedBg: '#ffdad6' },
  ];

  return (
    <Box>
      <Box
        sx={{
          maxWidth: 768,
          mx: 'auto',
          mt: { xs: 2, md: 4 },
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: '-5%',
            width: 256,
            height: 256,
            backgroundColor: '#f3ff00',
            border: '4px solid #1b1c17',
            rotate: '12deg',
            zIndex: -10,
            opacity: 0.2,
            clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
          }}
        />

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
              '&:active': {
                transform: 'translate(4px, 4px)',
                boxShadow: 'none',
              },
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
              New Mission
            </Box>
            <Box
              sx={{
                fontFamily: '"Space Mono", monospace',
                fontWeight: 700,
                fontSize: '14px',
                color: '#5e6300',
              }}
            >
              TASK_ID: {Math.floor(1000 + Math.random() * 9000)}-ALPHA
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

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Box>
              <NeoInput
                label="Task Title"
                placeholder="ENTER A BOLD TITLE..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
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
                  Deadline
                </Box>
                <Box sx={{ position: 'relative' }}>
                  <EventIcon
                    sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: '#1b1c17' }}
                  />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
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
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#ba1a1a', border: '2px solid #1b1c17', display: 'inline-block' }} />
                  Priority Level
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {priorityOptions.map((opt) => (
                    <Box
                      key={opt.value}
                      component="label"
                      sx={{ flex: 1, cursor: 'pointer' }}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={opt.value}
                        checked={priority === opt.value}
                        onChange={() => setPriority(opt.value)}
                        style={{ display: 'none' }}
                      />
                      <Box
                        sx={{
                          textAlign: 'center',
                          p: 1.5,
                          border: '4px solid #1b1c17',
                          fontFamily: '"Space Mono", monospace',
                          fontWeight: 700,
                          fontSize: '14px',
                          textTransform: 'uppercase',
                          color: '#1b1c17',
                          backgroundColor: priority === opt.value ? opt.checkedBg : '#ffffff',
                          boxShadow: priority === opt.value ? '2px 2px 0px 0px rgba(0,0,0,1)' : 'none',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {opt.label}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            <Box>
              <NeoInput
                label="Detailed Briefing"
                placeholder="DESCRIBE THE OBJECTIVES IN DETAIL..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={6}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  fontFamily: '"Space Mono", monospace',
                  fontWeight: 700,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  width: '100%',
                  mb: 0.5,
                  color: '#1b1c17',
                }}
              >
                Category Tags
              </Box>
              {['DEVELOPMENT', 'URGENT', 'CLIENT-A'].map((tag) => (
                <Box
                  key={tag}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    border: '2px solid #1b1c17',
                    fontFamily: '"Space Mono", monospace',
                    fontWeight: 700,
                    fontSize: '12px',
                    color: '#1b1c17',
                    backgroundColor: '#dae1ff',
                  }}
                >
                  {tag}
                </Box>
              ))}
              <Box
                component="button"
                type="button"
                sx={{
                  px: 1.5,
                  py: 0.5,
                  border: '2px dashed #1b1c17',
                  fontFamily: '"Space Mono", monospace',
                  fontWeight: 700,
                  fontSize: '12px',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: '#1b1c17',
                  transition: 'background-color 0.15s ease',
                  '&:hover': { backgroundColor: '#e4e3db' },
                }}
              >
                + ADD TAG
              </Box>
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
              {submitting ? 'CREATING...' : 'CREATE TASK'}
              <BoltIcon
                sx={{
                  fontSize: 40,
                  fontWeight: 700,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'rotate(12deg)' },
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            fontFamily: '"Space Mono", monospace',
            fontSize: '14px',
            textTransform: 'uppercase',
            color: '#474832',
            px: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00fe66' }} />
              AUTO-SAVING...
            </Box>
            <Box sx={{ opacity: 0.4 }}>|</Box>
            <Box>DRAFT STORED AT {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box component="a" href="#" sx={{ color: '#474832', textDecoration: 'underline', '&:hover': { textDecoration: 'none' } }}>
              Discard Draft
            </Box>
            <Box component="a" href="#" sx={{ color: '#474832', textDecoration: 'underline', '&:hover': { textDecoration: 'none' } }}>
              Copy Template
            </Box>
          </Box>
        </Box>
      </Box>

      <NeoModal
        open={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigate('/tasks');
        }}
        title="TASK ENGAGED!"
        description="The mission has been successfully added to your task orbit."
        action={
          <NeoConfirmButton
            onClick={() => {
              setShowSuccess(false);
              navigate('/tasks');
            }}
          />
        }
      />
    </Box>
  );
}
