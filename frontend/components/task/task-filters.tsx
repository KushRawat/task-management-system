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
    <div className="card rounded-2xl border border-neutral-200 p-3 shadow-card dark:border-neutral-800">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.3fr,0.7fr,0.7fr]">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={handleSearch}
          className="w-full"
        />
        <Select value={status || "ALL"} onChange={handleStatus} className="w-full">
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="COMPLETED">Completed</option>
        </Select>
        <Select value={priority || "ALL"} onChange={handlePriority} className="w-full">
          <option value="ALL">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </Select>
      </div>
    </div>
  );
};
