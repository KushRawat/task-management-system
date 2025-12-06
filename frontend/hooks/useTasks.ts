'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { taskApi } from "@/lib/api-client";
import { PaginatedTasks, TaskStatus } from "@/lib/types";

type Filters = {
  page?: number;
  pageSize?: number;
  status?: TaskStatus;
  search?: string;
};

export const useTasks = (filters: Filters) => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery<PaginatedTasks>({
    queryKey: ["tasks", filters],
    queryFn: () => taskApi.list(filters),
    keepPreviousData: true,
  });

  const createTask = useMutation({
    mutationFn: taskApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created");
    },
    onError: (error: any) => toast.error(error?.message ?? "Unable to create task"),
  });

  const updateTask = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      taskApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated");
    },
    onError: (error: any) => toast.error(error?.message ?? "Unable to update task"),
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => taskApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task removed");
    },
    onError: (error: any) => toast.error(error?.message ?? "Unable to delete task"),
  });

  const toggleTask = useMutation({
    mutationFn: (id: string) => taskApi.toggle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Status toggled");
    },
    onError: (error: any) => toast.error(error?.message ?? "Unable to update status"),
  });

  return { tasksQuery, createTask, updateTask, deleteTask, toggleTask };
};
