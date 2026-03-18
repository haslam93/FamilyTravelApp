"use client";

import { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { ActivityCard } from "./activity-card";

interface Activity {
  id: string;
  name: string;
  type: string;
  status: string;
  startTime: string | null;
  endTime: string | null;
  notes: string | null;
  sortOrder: number;
}

interface SortableActivityItemProps {
  activity: Activity;
  index: number;
  isLast: boolean;
  onStatusChange: (status: string) => void;
}

function SortableActivityItem({
  activity,
  index,
  isLast,
  onStatusChange,
}: SortableActivityItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity touch-none cursor-grab active:cursor-grabbing z-20 p-1 rounded-lg bg-white/80 shadow-sm"
        aria-label="Drag to reorder"
      >
        <GripVertical size={16} className="text-slate-400" />
      </button>
      <ActivityCard
        activity={activity}
        index={index}
        isLast={isLast}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}

interface SortableActivityListProps {
  activities: Activity[];
  onReorder: (reorderedActivities: Activity[]) => void;
  onStatusChange: (activityId: string, newStatus: string) => void;
}

export function SortableActivityList({
  activities,
  onReorder,
  onStatusChange,
}: SortableActivityListProps) {
  const sorted = [...activities].sort((a, b) => a.sortOrder - b.sortOrder);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = sorted.findIndex((a) => a.id === active.id);
      const newIndex = sorted.findIndex((a) => a.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(sorted, oldIndex, newIndex).map(
        (activity, idx) => ({
          ...activity,
          sortOrder: idx,
        })
      );

      onReorder(reordered);
    },
    [sorted, onReorder]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sorted.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 pl-6">
          {sorted.map((activity, index) => (
            <SortableActivityItem
              key={activity.id}
              activity={activity}
              index={index}
              isLast={index === sorted.length - 1}
              onStatusChange={(newStatus) =>
                onStatusChange(activity.id, newStatus)
              }
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
