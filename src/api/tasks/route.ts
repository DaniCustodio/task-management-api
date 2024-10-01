import type { FastifyInstance } from 'fastify'
import { db } from '../../database/db'
import type { Task } from '../../types'
import { createTasksRoute } from './create-tasks/create-tasks'
import { getTasks } from './get-tasks/get-tasks'
import { TaskRepository } from './repository'
import { updateTasks } from './update-tasks/update-tasks'

interface Response<D> {
	message?: string
	data?: D
}

export async function tasksRoute(app: FastifyInstance) {
	const repository = new TaskRepository(db)

	createTasksRoute(app, repository)

	app.get<{
		Reply: Response<Task[]>
	}>('/', getTasks)

	app.put<{
		Reply: Response<Task>
	}>('/:id', updateTasks)
}
