import { randomUUID } from 'node:crypto'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { Task } from '../../../types'
import type { TaskRepo } from '../repository'
import type { CreateTask } from './schema'

interface Response<D> {
	message?: string
	data?: D
}

interface CreateTaskRequestBody {
	title: string
	description: string
}

export async function createTasksRoute(
	app: FastifyInstance,
	repository: TaskRepo
) {
	return app.post<{
		Body: CreateTaskRequestBody
		Reply: Response<Task>
	}>('/', async (req, res) => {
		try {
			let sessionId = req.cookies.sessionId
			if (!sessionId) {
				sessionId = randomUUID()
				res.setCookie('sessionId', sessionId, {
					path: '/',
					httpOnly: true,
					maxAge: 60 * 60 * 24 * 7,
				})
			}

			const { title, description } = req.body
			const task: CreateTask = {
				id: randomUUID(),
				sessionId,
				title: title,
				description: description,
			}

			const result = await repository.createTask(task)

			res.status(201)
			res.send({ data: result })
		} catch (error) {
			console.log(error)
			res.status(500)
			res.send({ message: 'Internal server error' })
		}
	})
}
