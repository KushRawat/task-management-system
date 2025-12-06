'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { TaskFilters } from "@/components/task/task-filters";
import { TaskCard } from "@/components/task/task-card";
import { TaskForm } from "@/components/task/task-form";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { useAuthStore } from "@/lib/auth-store";
import { useTasks } from "@/hooks/useTasks";
import { Task, TaskStatus } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const [filters, setFilters] = useState<{
    page: number;
    pageSize: number;
    status?: TaskStatus;
    search?: string;
  }>({ page: 1, pageSize: 6 });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!user || !accessToken) {
      router.replace("/login");
    }
  }, [user, accessToken, router]);

  const { tasksQuery, createTask, updateTask, deleteTask, toggleTask } =
    useTasks(filters);

  const meta = tasksQuery.data?.meta;
  const tasks = tasksQuery.data?.data || [];

  const handleCreate = async (values: any) => {
    try {
      await createTask.mutateAsync(values);
      setShowForm(false);
    } catch (error) {
      // toast handled in mutation
    }
  };

  const handleUpdate = async (values: any) => {
    if (!editingTask) return;
    try {
      await updateTask.mutateAsync({ id: editingTask.id, payload: values });
      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      // toast handled in mutation
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask.mutateAsync(id);
    } catch (error) {
      // toast handled in mutation
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTask.mutateAsync(id);
    } catch (error) {
      // toast handled in mutation
    }
  };

  const openForCreate = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const openForEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const changePage = (delta: number) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, prev.page + delta),
    }));
  };

  const emptyState = !tasksQuery.isLoading && tasks.length === 0;

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <div className="grid gap-4 rounded-3xl border border-white/5 bg-gradient-to-r from-white/5 via-white/10 to-transparent p-6 shadow-card sm:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
              Dashboard
            </p>
            <h1 className="text-3xl font-bold text-white">
              Own every task, stay in rhythm
            </h1>
            <p className="text-sm text-slate-300">
              Filter by status, search titles, and manage tasks with optimistic UI backed by a secure API.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-end">
            <Button onClick={openForCreate}>Create task</Button>
            <Button variant="secondary" onClick={() => tasksQuery.refetch()}>
              Refresh
            </Button>
          </div>
        </div>

        <TaskFilters
          onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f, page: 1 }))}
          onCreate={openForCreate}
          initialStatus={filters.status}
          initialSearch={filters.search}
        />

        {tasksQuery.isLoading ? (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        ) : emptyState ? (
          <Card className="flex flex-col items-center gap-3 py-10 text-center border border-dashed border-white/10">
            <p className="text-lg font-semibold text-white">No tasks yet</p>
            <p className="text-sm text-slate-400">
              Create your first task to get moving.
            </p>
            <Button onClick={openForCreate}>Add a task</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => handleToggle(task.id)}
                  onEdit={() => openForEdit(task)}
                  onDelete={() => handleDelete(task.id)}
                />
              ))}
            </div>
            {meta && (
              <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-200">
                <span>
                  Page {meta.page} of {meta.totalPages || 1} · {meta.total} tasks
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    disabled={meta.page <= 1}
                    onClick={() => changePage(-1)}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => changePage(1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editingTask ? "Edit task" : "Create task"}
      >
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={() => setShowForm(false)}
          submitLabel={editingTask ? "Update" : "Create"}
        />
      </Modal>
    </>
  );
}
