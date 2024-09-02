import type { FastifyInstance } from 'fastify'
import { createTasks } from './create-tasks'

interface Response<D> {
	message?: string
	data?: D
}

interface Task {
	title: string
	description: string
	completedAt: string | null
	createdAt: string
	updatedAt: string
}

export async function tasksRoute(app: FastifyInstance) {
	app.post<{
		Reply: Response<Task>
	}>('/', createTasks)
}
