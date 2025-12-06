'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { TaskFilters } from "@/components/task/task-filters";
import { TaskCard } from "@/components/task/task-card";
import { TaskTable } from "@/components/task/task-table";
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
    priority?: "LOW" | "MEDIUM" | "HIGH";
    search?: string;
  }>({ page: 1, pageSize: 6 });
  const [layout, setLayout] = useState<"cards" | "table">("cards");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

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
      setActiveActionId(id);
      await deleteTask.mutateAsync(id);
      setTaskToDelete(null);
    } catch (error) {
      // toast handled in mutation
    } finally {
      setActiveActionId(null);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      setActiveActionId(id);
      await toggleTask.mutateAsync(id);
    } catch (error) {
      // toast handled in mutation
    } finally {
      setActiveActionId(null);
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
  const hasError = tasksQuery.isError;
  const isAuthenticated = !!user && !!accessToken;

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <Card className="flex flex-col gap-4 border border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Dashboard
              </p>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                My Tasks
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Add, edit, filter, and conquer your work with a clean, responsive experience.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={openForCreate}>Add task</Button>
              <Button variant="secondary" onClick={() => tasksQuery.refetch()}>
                Refresh
              </Button>
              <div className="rounded-full border border-neutral-200 bg-white p-1 text-xs text-neutral-700 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                <div className="flex">
                  <button
                    className={`rounded-full px-3 py-1 ${layout === "cards" ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-100 shadow" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
                    onClick={() => setLayout("cards")}
                  >
                    Cards
                  </button>
                  <button
                    className={`rounded-full px-3 py-1 ${layout === "table" ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-100 shadow" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
                    onClick={() => setLayout("table")}
                  >
                    Table
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <TaskFilters
            onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f, page: 1 }))}
            initialStatus={filters.status}
            initialPriority={filters.priority}
            initialSearch={filters.search}
          />
        </div>

        {!isAuthenticated ? (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        ) : tasksQuery.isLoading ? (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        ) : hasError ? (
          <Card className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">Something went wrong</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Unable to load tasks. Please try again.
            </p>
            <Button onClick={() => tasksQuery.refetch()}>Retry</Button>
          </Card>
        ) : emptyState ? (
          <Card className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">No tasks yet</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Create your first task to get moving.
            </p>
            <Button onClick={openForCreate}>Add a task</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {layout === "cards" ? (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={() => handleToggle(task.id)}
                    onEdit={() => openForEdit(task)}
                    onDelete={() => setTaskToDelete(task)}
                    toggleLoading={toggleTask.isPending && activeActionId === task.id}
                    deleteLoading={deleteTask.isPending && activeActionId === task.id}
                  />
                ))}
              </div>
            ) : (
              <TaskTable
                tasks={tasks}
                onEdit={openForEdit}
                onDelete={(task) => setTaskToDelete(task)}
                onToggle={handleToggle}
                toggleLoadingId={toggleTask.isPending ? activeActionId : null}
                deleteLoadingId={deleteTask.isPending ? activeActionId : null}
              />
            )}
            {meta && (
              <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
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

      <Modal
        open={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        title="Delete task"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Are you sure you want to delete “{taskToDelete?.title}”? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setTaskToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => taskToDelete && handleDelete(taskToDelete.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
