'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Task } from "@/lib/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  startDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof schema>;

export const TaskForm = ({
  task,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: {
  task?: Task | null;
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "PENDING",
      priority: task?.priority || "MEDIUM",
      startDate: task?.startDate ? task.startDate.split("T")[0] : "",
      dueDate: task?.dueDate ? task.dueDate.split("T")[0] : "",
    },
  });

  useEffect(() => {
    reset({
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "PENDING",
      priority: task?.priority || "MEDIUM",
      startDate: task?.startDate ? task.startDate.split("T")[0] : "",
      dueDate: task?.dueDate ? task.dueDate.split("T")[0] : "",
    });
  }, [task, reset]);

  const submitHandler = async (values: FormValues) => {
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Title</label>
        <Input placeholder="Ship dashboard polish" {...register("title")} />
        {errors.title && (
          <p className="text-xs text-danger">{errors.title.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Description</label>
        <textarea
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-primary-400 dark:focus:ring-primary-500/40"
          rows={3}
          placeholder="Optional context, links, or checklists"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-danger">
            {errors.description.message as string}
          </p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Status</label>
          <Select {...register("status")}>
            {["PENDING", "IN_PROGRESS", "COMPLETED"].map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Priority</label>
          <Select {...register("priority")}>
            {["LOW", "MEDIUM", "HIGH"].map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Start date</label>
          <Input type="date" {...register("startDate")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Due date</label>
          <Input type="date" {...register("dueDate")} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
