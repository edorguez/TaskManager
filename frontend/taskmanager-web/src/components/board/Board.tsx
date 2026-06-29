import { useState, useCallback, useMemo } from 'react';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { Box } from '@mui/material';
import { StatusChip } from '../ui/NeoChip';
import { Column } from './Column';
import type { Task, TaskStatus } from '../../types';

interface BoardProps {
  tasks: Task[];
  statuses: TaskStatus[];
  onDelete: (id: string) => void;
  onStatusChange: (taskId: string, statusId: number) => void;
}

const columns = [
  { id: 'Todo', title: 'Todo' },
  { id: 'InProgress', title: 'In Progress' },
  { id: 'Done', title: 'Done' },
];

export function Board({ tasks, statuses, onDelete, onStatusChange }: BoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  );

  const activeTask = useMemo(
    () => (activeId ? tasks.find((t) => t.id === activeId) ?? null : null),
    [activeId, tasks],
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const activeData = active.data.current;
      const overData = over.data.current;

      if (activeData?.type !== 'task') return;

      let newStatus: string | null = null;

      if (overData?.type === 'column') {
        newStatus = String(over.id);
      } else if (overData?.type === 'task') {
        const overTask = tasks.find((t) => t.id === over.id);
        if (overTask) {
          newStatus = overTask.status;
        }
      }

      if (!newStatus) return;

      const task = tasks.find((t) => t.id === active.id);
      const status = statuses.find((s) => s.name === newStatus);
      if (task && status && task.status !== newStatus) {
        onStatusChange(String(active.id), status.id);
      }
    },
    [tasks, statuses, onStatusChange],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 3, md: 4 },
          alignItems: { xs: 'stretch', md: 'flex-start' },
        }}
      >
        {columns.map((col) => {
          const status = statuses.find((s) => s.name === col.id);
          return (
            <Box
              key={col.id}
              sx={{
                flex: { md: 1 },
                width: { xs: '100%', md: 'auto' },
                minWidth: { md: 0 },
              }}
            >
              <Column
                id={col.id}
                title={col.title}
                statusId={status?.id ?? 1}
                tasks={tasks.filter((t) => t.status === col.id)}
                onDelete={onDelete}
              />
            </Box>
          );
        })}
      </Box>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <Box
            sx={{
              backgroundColor: activeTask.status === 'InProgress' ? '#f3ff00' : '#ffffff',
              border: '4px solid #1b1c17',
              boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)',
              transform: 'rotate(-2deg) scale(0.95)',
              opacity: 0.9,
              p: { xs: 2, md: 3 },
              width: { xs: '220px', md: '280px' },
              pointerEvents: 'none',
            }}
          >
            <Box sx={{ mb: 1.5 }}>
              <StatusChip status={activeTask.status} />
            </Box>
            <Box
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 800,
                fontSize: { xs: '18px', md: '24px' },
                textTransform: 'uppercase',
                mb: 0.5,
                lineHeight: 1.2,
                color: '#1b1c17',
              }}
            >
              {activeTask.title}
            </Box>
            <Box
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 400,
                fontSize: { xs: '12px', md: '16px' },
                color: '#474832',
                opacity: 0.7,
              }}
            >
              {activeTask.description || 'No description'}
            </Box>
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
