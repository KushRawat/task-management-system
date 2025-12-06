'use client';

import { ChangeEvent, useState } from "react";
import { Select } from "../ui/select";
import { Input } from "../ui/input";
import { TaskStatus } from "@/lib/types";

export const TaskFilters = ({
  onFilterChange,
  initialStatus,
  initialPriority,
  initialSearch,
}: {
  onFilterChange: (filters: { status?: TaskStatus; priority?: "LOW" | "MEDIUM" | "HIGH"; search?: string }) => void;
  initialStatus?: TaskStatus;
  initialPriority?: "LOW" | "MEDIUM" | "HIGH";
  initialSearch?: string;
}) => {
  const [search, setSearch] = useState(initialSearch || "");
  const [status, setStatus] = useState<TaskStatus | undefined>(initialStatus);
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | undefined>(initialPriority);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ status, priority, search: value });
  };

  const handleStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TaskStatus;
    const nextStatus = value === "ALL" ? undefined : value;
    setStatus(nextStatus);
    onFilterChange({ status: nextStatus, priority, search });
  };

  const handlePriority = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "LOW" | "MEDIUM" | "HIGH" | "ALL";
    const nextPriority = value === "ALL" ? undefined : (value as "LOW" | "MEDIUM" | "HIGH");
    setPriority(nextPriority);
    onFilterChange({ status, priority: nextPriority, search });
  };

  return (
    <div className="card flex flex-col gap-3 rounded-2xl border border-neutral-200 p-3 shadow-card dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap gap-2">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={handleSearch}
          className="min-w-[240px] flex-1"
        />
        <Select
          value={status || "ALL"}
          onChange={handleStatus}
          className="w-[180px]"
        >
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="COMPLETED">Completed</option>
        </Select>
        <Select
          value={priority || "ALL"}
          onChange={handlePriority}
          className="w-[160px]"
        >
          <option value="ALL">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </Select>
      </div>
    </div>
  );
};
