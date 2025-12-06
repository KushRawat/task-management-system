'use client';

import { Task } from "@/lib/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CheckCircle2, Edit3, Trash2 } from "lucide-react";

const statusMap: Record<Task["status"], { label: string; variant: "warning" | "primary" | "success" }> = {
  PENDING: { label: "Pending", variant: "warning" },
  IN_PROGRESS: { label: "In progress", variant: "primary" },
  COMPLETED: { label: "Completed", variant: "success" },
};

const priorityMap: Record<Task["priority"], { label: string; variant: "danger" | "primary" | "neutral" }> = {
  HIGH: { label: "High", variant: "danger" },
  MEDIUM: { label: "Medium", variant: "primary" },
  LOW: { label: "Low", variant: "neutral" },
};

export const TaskTable = ({
  tasks,
  onEdit,
  onDelete,
  onToggle,
}: {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (id: string) => void;
}) => {
  return (
    <div className="overflow-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Title</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-left font-semibold">Priority</th>
            <th className="px-4 py-3 text-left font-semibold">Start</th>
            <th className="px-4 py-3 text-left font-semibold">Due</th>
            <th className="px-4 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {tasks.map((task) => {
            const status = statusMap[task.status];
            const priority = priorityMap[task.priority];
            const start = task.startDate ? new Date(task.startDate).toLocaleDateString() : "—";
            const due = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—";
            return (
              <tr key={task.id} className="bg-white text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
                <td className="px-4 py-3">
                  <div className="font-semibold">{task.title}</div>
                  {task.description && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">{task.description}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={status.variant}>{status.label}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={priority.variant}>{priority.label}</Badge>
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">{start}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">{due}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => onEdit(task)} icon={<Edit3 size={16} />}>
                      Edit
                    </Button>
                    <Button variant="ghost" onClick={() => onToggle(task.id)} icon={<CheckCircle2 size={16} />}>
                      {task.status === "COMPLETED" ? "Mark pending" : "Mark done"}
                    </Button>
                    <Button variant="danger" onClick={() => onDelete(task)} icon={<Trash2 size={16} />}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
