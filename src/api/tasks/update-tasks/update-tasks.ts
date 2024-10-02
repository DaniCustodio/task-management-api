import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import type { Task } from '../../../types'
import type { TaskRepo } from '../repository'
import {
	type UpdateTask,
	type UpdateTasksParams,
	UpdateTasksParamsSchema,
	UpdateTasksSchema,
} from './schema'

interface Response<D> {
	message?: string
	data?: D
}

export async function updateTasksRoute(
	app: FastifyInstance,
	repository: TaskRepo
) {
	return app.put<{
		Querystring: UpdateTasksParams
		Body: UpdateTask
		Reply: Response<Task>
	}>('/:id', async (req, res) => {
		try {
			const sessionId = req.cookies.sessionId
			if (!sessionId) {
				res.status(401)
				res.send({ message: 'please provide a session id' })
				return
			}

			const params = UpdateTasksParamsSchema.parse(req.params)

			const body = UpdateTasksSchema.parse(req.body)
			const { title, description } = body
			if (!title && !description) {
				res.status(400)
				res.send({ message: 'please provide a valid title or description' })
				return
			}

			const updateFields: { title?: string; description?: string } = {}
			if (title && title.length > 0) {
				updateFields.title = title
			}
			if (description && description.length > 0) {
				updateFields.description = description
			}
			console.log('UPDATE FIELDS', updateFields)
			const doesTheTaskExist = await repository.findTask(params.id, sessionId)

			if (!doesTheTaskExist) {
				res.status(404)
				res.send({ message: 'the task with the specified ID does not exist' })
				return
			}

			const updatedTask = await repository.updateTask({
				id: params.id,
				session_id: sessionId,
				updateFields,
			})

			if (!updatedTask) {
				res.status(404)
				res.send({ message: 'the task with the specified ID does not exist' })
				return
			}

			res.status(200)
			res.send({ data: updatedTask })
		} catch (error) {
			console.error('🚨 ERROR', error)
			if (error instanceof ZodError) {
				if (error.errors[0].code === 'too_small') {
					res.status(400)
					res.send({ message: 'please provide a valid title or description' })
					return
				}

				res.status(404)
				res.send({
					message: 'the task with the specified ID does not exist',
				})
				return
			}
			res.status(500)
			res.send({ message: 'an error occurred while updating the task' })
		}
	})
}
