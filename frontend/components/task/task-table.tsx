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
  toggleLoadingId,
  deleteLoadingId,
}: {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (id: string) => void;
  toggleLoadingId?: string | null;
  deleteLoadingId?: string | null;
}) => {
  return (
    <div className="overflow-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <table className="min-w-full text-sm border-collapse table-fixed">
        <thead className="bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
          <tr>
            <th className="px-6 py-3 text-left font-semibold w-[26%]">Title</th>
            <th className="px-6 py-3 text-left font-semibold w-[14%]">Status</th>
            <th className="px-6 py-3 text-left font-semibold w-[14%]">Priority</th>
            <th className="px-6 py-3 text-left font-semibold w-[12%]">Start</th>
            <th className="px-6 py-3 text-left font-semibold w-[12%]">Due</th>
            <th className="px-6 py-3 text-left font-semibold w-[22%]">Actions</th>
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
                <td className="px-6 py-3 align-top">
                  <div className="font-semibold">{task.title}</div>
                  {task.description && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">{task.description}</p>
                  )}
                </td>
                <td className="px-6 py-3 align-top">
                  <Badge variant={status.variant}>{status.label}</Badge>
                </td>
                <td className="px-6 py-3 align-top">
                  <Badge variant={priority.variant}>{priority.label}</Badge>
                </td>
                <td className="px-6 py-3 text-neutral-600 dark:text-neutral-300 align-top">{start}</td>
                <td className="px-6 py-3 text-neutral-600 dark:text-neutral-300 align-top">{due}</td>
                <td className="px-6 py-3 align-top">
                  <div className="flex flex-nowrap items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => onEdit(task)} icon={<Edit3 size={14} />}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onToggle(task.id)}
                      icon={<CheckCircle2 size={14} />}
                      loading={toggleLoadingId === task.id}
                    >
                      {task.status === "COMPLETED" ? "Mark pending" : "Mark done"}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(task)}
                      icon={<Trash2 size={14} />}
                      loading={deleteLoadingId === task.id}
                    >
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
