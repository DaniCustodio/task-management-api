import type { FastifyInstance } from 'fastify'
import { createTasks } from './create-tasks'
import { getTasks } from './get-tasks'
import { updateTasks } from './update-tasks'

interface Response<D> {
	message?: string
	data?: D
}

export interface Task {
	id: string
	session_id: string
	title: string
	description: string
	completed_at: string | null
	created_at: string
	updated_at: string
}

export async function tasksRoute(app: FastifyInstance) {
	app.post<{
		Reply: Response<Task>
	}>('/', createTasks)

	app.get<{
		Reply: Response<Task[]>
	}>('/', getTasks)

	app.put<{
		Reply: Response<Task>
	}>('/:id', updateTasks)
}
