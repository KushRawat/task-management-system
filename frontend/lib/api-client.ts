'use client';

import { PaginatedTasks, Task, TaskStatus, User } from "./types";
import { useAuthStore } from "./auth-store";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

type AuthResponse = { user: User; accessToken: string };

const buildQuery = (params?: Record<string, string | number | undefined>) => {
  if (!params) return "";
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

const refreshAccessToken = async (): Promise<string | null> => {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) return null;
  const data: AuthResponse = await res.json();
  useAuthStore.getState().setSession(data.user, data.accessToken);
  return data.accessToken;
};

export const apiFetch = async <T>(
  path: string,
  options: RequestInit = {},
  attemptRefresh = true
): Promise<T> => {
  const { accessToken, logout } = useAuthStore.getState();
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && attemptRefresh) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiFetch<T>(path, options, false);
    }
    logout();
    throw new Error("Please log in again");
  }

  if (!response.ok) {
    let message = "Request failed";
    try {
      const body = await response.json();
      message = body.message || message;
    } catch (error) {
      // no-op
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const authApi = {
  async login(payload: { email: string; password: string }) {
    return apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async register(payload: { email: string; password: string; name: string }) {
    return apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async logout() {
    await apiFetch<{ message: string }>("/auth/logout", { method: "POST" });
    useAuthStore.getState().logout();
  },
};

export const taskApi = {
  async list(params: {
    page?: number;
    pageSize?: number;
    status?: TaskStatus;
    search?: string;
  }) {
    return apiFetch<PaginatedTasks>(
      `/tasks${buildQuery({
        page: params.page,
        pageSize: params.pageSize,
        status: params.status,
        search: params.search,
      })}`
    );
  },
  async create(payload: { title: string; description?: string }) {
    return apiFetch<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async update(id: string, payload: Partial<Task>) {
    return apiFetch<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  async remove(id: string) {
    return apiFetch<void>(`/tasks/${id}`, { method: "DELETE" });
  },
  async toggle(id: string) {
    return apiFetch<Task>(`/tasks/${id}/toggle`, { method: "PATCH" });
  },
};
