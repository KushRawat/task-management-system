'use client';

import { ChangeEvent, useState } from "react";
import { Select } from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { TaskStatus } from "@/lib/types";
import { Plus } from "lucide-react";

export const TaskFilters = ({
  onFilterChange,
  onCreate,
  initialStatus,
  initialSearch,
}: {
  onFilterChange: (filters: { status?: TaskStatus; search?: string }) => void;
  onCreate: () => void;
  initialStatus?: TaskStatus;
  initialSearch?: string;
}) => {
  const [search, setSearch] = useState(initialSearch || "");
  const [status, setStatus] = useState<TaskStatus | undefined>(initialStatus);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ status, search: value });
  };

  const handleStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TaskStatus;
    const nextStatus = value === "ALL" ? undefined : value;
    setStatus(nextStatus);
    onFilterChange({ status: nextStatus, search });
  };

  return (
    <div className="glass flex flex-col gap-4 rounded-2xl border border-white/5 p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap gap-3">
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
      </div>
      <Button icon={<Plus size={16} />} onClick={onCreate}>
        New Task
      </Button>
    </div>
  );
};
