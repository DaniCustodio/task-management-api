import { prisma } from '@/lib/prisma'
import type { NewTask, Task } from '@/types'
import type {
	CompleteTask,
	DeleteTask,
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

	async delete({ id, sessionId }: DeleteTask): Promise<Task | null> {
		try {
			const deletedTask = await prisma.task.delete({
				where: {
					id,
					session_id: sessionId,
				},
			})

			return deletedTask
		} catch (error) {
			console.log('❌ Error deleting task:', error)
			return null
		}
	}

	async toggleComplete({ id, sessionId }: CompleteTask): Promise<Task | null> {
		const task = await prisma.task.findUnique({
			where: {
				id,
				session_id: sessionId,
			},
		})

		if (!task) {
			return null
		}

		const completedAt = task.completed_at ? null : new Date().toISOString()

		const updatedTask = await prisma.task.update({
			where: {
				id: id,
				session_id: sessionId,
			},
			data: {
				completed_at: completedAt,
			},
		})

		return updatedTask
	}
}
