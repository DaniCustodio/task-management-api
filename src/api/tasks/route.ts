import type { FastifyInstance } from 'fastify'
import { db } from '../../database/db'
import { createTasksRoute } from './create-tasks'
import { getTasksRoute } from './get-tasks'
import { TaskRepository } from './repository'
import { updateTasksRoute } from './update-tasks'

export async function tasksRoute(app: FastifyInstance) {
	const repository = new TaskRepository(db)

	createTasksRoute(app, repository)
	getTasksRoute(app, repository)
	updateTasksRoute(app, repository)
}
