import type { FastifyInstance } from 'fastify'
import { db } from '../../database/db'
import type { Task } from '../../types'
import { createTasksRoute } from './create-tasks'
import { getTasksRoute } from './get-tasks'
import { TaskRepository } from './repository'
import { updateTasks } from './update-tasks/update-tasks'

interface Response<D> {
	message?: string
	data?: D
}

export async function tasksRoute(app: FastifyInstance) {
	const repository = new TaskRepository(db)

	createTasksRoute(app, repository)

	getTasksRoute(app, repository)

	app.put<{
		Reply: Response<Task>
	}>('/:id', updateTasks)
}
