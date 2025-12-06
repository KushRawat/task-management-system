'use client';

import { Task } from "@/lib/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Calendar, CheckCircle2, Edit3, Trash2 } from "lucide-react";

const statusMap: Record<
  Task["status"],
  { label: string; variant: "warning" | "primary" | "success" }
> = {
  PENDING: { label: "Pending", variant: "warning" },
  IN_PROGRESS: { label: "In progress", variant: "primary" },
  COMPLETED: { label: "Completed", variant: "success" },
};

const priorityMap: Record<Task["priority"], { label: string; variant: "danger" | "primary" | "neutral" }> = {
  HIGH: { label: "High", variant: "danger" },
  MEDIUM: { label: "Medium", variant: "primary" },
  LOW: { label: "Low", variant: "neutral" },
};

export const TaskCard = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  toggleLoading = false,
  deleteLoading = false,
}: {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  toggleLoading?: boolean;
  deleteLoading?: boolean;
}) => {
  const status = statusMap[task.status];
  const priority = priorityMap[task.priority];
  const start = task.startDate ? new Date(task.startDate) : null;
  const due = task.dueDate ? new Date(task.dueDate) : null;

  return (
    <Card padding="p-4" className="border border-neutral-200 dark:border-neutral-800">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.5fr,1fr,1fr,1fr,auto] md:items-center">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{task.title}</p>
          {task.description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">{task.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={priority.variant}>{priority.label}</Badge>
        </div>
        <div className="flex flex-col gap-1 text-sm text-neutral-600 dark:text-neutral-300">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-neutral-400 dark:text-neutral-500" />
            {start ? `Start: ${start.toLocaleDateString()}` : "No start date"}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-neutral-400 dark:text-neutral-500" />
            {due ? `Due: ${due.toLocaleDateString()}` : "No due date"}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={onEdit} icon={<Edit3 size={16} />}>
            Edit
          </Button>
          <Button variant="ghost" onClick={onToggle} icon={<CheckCircle2 size={16} />} loading={toggleLoading}>
            {task.status === "COMPLETED" ? "Mark pending" : "Mark done"}
          </Button>
          <Button variant="danger" onClick={onDelete} icon={<Trash2 size={16} />} loading={deleteLoading}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};
