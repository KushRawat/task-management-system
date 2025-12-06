'use client';

import { Task } from "@/lib/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import clsx from "clsx";

const statusMap: Record<
  Task["status"],
  { label: string; variant: "green" | "amber" | "blue" }
> = {
  PENDING: { label: "Pending", variant: "amber" },
  IN_PROGRESS: { label: "In progress", variant: "blue" },
  COMPLETED: { label: "Completed", variant: "green" },
};

export const TaskCard = ({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const status = statusMap[task.status];
  return (
    <Card className="flex flex-col gap-3 border border-white/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Task</p>
          <h3 className="text-lg font-semibold text-white">{task.title}</h3>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>
      {task.description && (
        <p className="text-sm text-slate-300">{task.description}</p>
      )}
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span>
          Created {new Date(task.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </span>
        <span className="h-1 w-1 rounded-full bg-slate-500" />
        <span>Updated {new Date(task.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={onToggle}
          className={clsx(
            task.status === "COMPLETED" ? "bg-emerald-500/20" : "bg-white/10"
          )}
        >
          {task.status === "COMPLETED" ? "Mark as pending" : "Complete it"}
        </Button>
        <Button variant="ghost" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="ghost" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </Card>
  );
};
