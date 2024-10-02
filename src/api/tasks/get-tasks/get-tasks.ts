import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { Task } from '../../../types'
import type { TaskRepo } from '../repository'
import { type GetTasksParams, GetTasksParamsSchema } from './schema'

interface Response<D> {
	message?: string
	data?: D
}

export async function getTasksRoute(
	app: FastifyInstance,
	repository: TaskRepo
) {
	return app.get<{
		Querystring: GetTasksParams
		Reply: Response<Task[]>
	}>('/', async (req, res) => {
		try {
			const sessionId = req.cookies.sessionId
			if (!sessionId) {
				res.status(401)
				res.send({ message: 'Unauthorized' })
				return
			}

			// QUESTION: If the users sends a title and description, should we search for both?
			// QUESTION: Should we do a fuzzy search?
			const params = GetTasksParamsSchema.parse(req.query)
			if (params?.title) {
				const tasks = await repository.findByTitle(params.title, sessionId)
				res.status(200).send({ data: tasks })
				return
			}

			if (params?.description) {
				const tasks = await repository.findByDescription(
					params.description,
					sessionId
				)
				res.status(200).send({ data: tasks })
				return
			}

			const tasks = await repository.findBySessionId(sessionId)

			res.status(200).send({ data: tasks })
		} catch (error) {
			console.log('🚨 ERROR', error)
			res.status(500).send({ message: 'Internal server error' })
		}
	})
}
