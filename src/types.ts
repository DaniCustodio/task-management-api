import type { Prisma, Task as PrismaTask } from '@prisma/client'

export type Task = PrismaTask
export type NewTask = Prisma.TaskCreateInput
