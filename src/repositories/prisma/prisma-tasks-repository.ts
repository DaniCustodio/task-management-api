import { prisma } from '@/lib/prisma'
import type { NewTask, Task } from '@/types'
import type {
	FindByDescription,
	FindById,
	FindByTitle,
	TaskRepository,
	UpdateTask,
} from '../tasks-repository'

export class PrismaTasksRepository implements TaskRepository {
	async create(task: NewTask): Promise<Task> {
		const createdTask = await prisma.task.create({
			data: task,
		})

		return createdTask
	}

	async findByTitle({ title, sessionId }: FindByTitle): Promise<Task[]> {
		const task = await prisma.task.findMany({
			where: {
				title,
				session_id: sessionId,
			},
		})

		return task
	}

	async findByDescription({
		description,
		sessionId,
	}: FindByDescription): Promise<Task[]> {
		const task = await prisma.task.findMany({
			where: {
				description,
				session_id: sessionId,
			},
		})

		return task
	}

	async findById({ id, sessionId }: FindById): Promise<Task | null> {
		const task = await prisma.task.findUnique({
			where: {
				id,
				session_id: sessionId,
			},
		})

		return task
	}

	async findBySessionId(sessionId: string): Promise<Task[]> {
		const task = await prisma.task.findMany({
			where: {
				session_id: sessionId,
			},
		})

		return task
	}

	async update(task: UpdateTask): Promise<Task> {
		const updatedTask = await prisma.task.update({
			where: {
				id: task.id,
			},
			data: task,
		})

		return updatedTask
	}
}
