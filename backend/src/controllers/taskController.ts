import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { HttpError } from "../utils/httpError";
import { asyncHandler } from "../utils/asyncHandler";

const taskStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED"] as const;
const priorities = ["LOW", "MEDIUM", "HIGH"] as const;
type TaskStatus = (typeof taskStatuses)[number];
type TaskPriority = (typeof priorities)[number];

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(taskStatuses).optional(),
  priority: z.enum(priorities).optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(taskStatuses).optional(),
  priority: z.enum(priorities).optional(),
  startDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(10),
  status: z.enum(taskStatuses).optional(),
  priority: z.enum(priorities).optional(),
  search: z.string().optional(),
});

export const listTasks = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const { page, pageSize, status, priority, search } = querySchema.parse(req.query);

  const where = {
    userId: req.user.id,
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
    ...(search ? { title: { contains: search } } : {}),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.task.count({ where }),
  ]);

  res.json({
    data: tasks,
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const input = createTaskSchema.parse(req.body);
  const startDate = input.startDate ? new Date(input.startDate) : undefined;
  const dueDate = input.dueDate ? new Date(input.dueDate) : undefined;

  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status ?? "PENDING",
      priority: input.priority ?? "MEDIUM",
      startDate,
      dueDate,
      userId: req.user.id,
    },
  });

  res.status(201).json(task);
});

export const getTask = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const { id } = req.params;

  const task = await prisma.task.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!task) {
    throw new HttpError(404, "Task not found");
  }

  res.json(task);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const { id } = req.params;
  const input = updateTaskSchema.parse(req.body);
  const startDate = input.startDate ? new Date(input.startDate) : null;
  const dueDate = input.dueDate ? new Date(input.dueDate) : null;

  const existing = await prisma.task.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!existing) {
    throw new HttpError(404, "Task not found");
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...input,
      startDate: input.startDate === undefined ? undefined : startDate,
      dueDate: input.dueDate === undefined ? undefined : dueDate,
    },
  });

  res.json(task);
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const { id } = req.params;

  const existing = await prisma.task.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!existing) {
    throw new HttpError(404, "Task not found");
  }

  await prisma.task.delete({ where: { id } });
  res.status(204).send();
});

export const toggleTask = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const { id } = req.params;

  const existing = await prisma.task.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!existing) {
    throw new HttpError(404, "Task not found");
  }

  const nextStatus =
    existing.status === "COMPLETED" ? "PENDING" : "COMPLETED";

  const task = await prisma.task.update({
    where: { id },
    data: { status: nextStatus },
  });

  res.json(task);
});
