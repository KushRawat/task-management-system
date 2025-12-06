'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Task } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
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
    },
  });

  useEffect(() => {
    reset({
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "PENDING",
    });
  }, [task, reset]);

  const submitHandler = async (values: FormValues) => {
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-slate-200">Title</label>
        <Input placeholder="Ship dashboard polish" {...register("title")} />
        {errors.title && (
          <p className="text-xs text-amber-300">{errors.title.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-200">Description</label>
        <textarea
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/50"
          rows={3}
          placeholder="Optional context, links, or checklists"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-amber-300">
            {errors.description.message as string}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-200">Status</label>
        <Select {...register("status")}>
          {["PENDING", "IN_PROGRESS", "COMPLETED"].map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ")}
            </option>
          ))}
        </Select>
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
