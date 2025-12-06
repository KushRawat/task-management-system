export type User = {
  id: string;
  email: string;
  name: string;
};

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedTasks = {
  data: Task[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};
