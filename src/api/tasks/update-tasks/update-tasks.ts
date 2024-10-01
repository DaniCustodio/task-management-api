import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { TaskRepository } from '../repository'
import { db } from '../../../database/db'

export async function updateTasks(req: FastifyRequest, res: FastifyReply) {
	const taskRepository = new TaskRepository(db)

	const sessionId = req.cookies.sessionId
	if (!sessionId) {
		res.status(401)
		res.send({ message: 'please provide a session id' })
		return
	}

	const { id } = validateParams(req.params)
	if (!id) {
		res.status(404)
		res.send({ message: 'the task with the specified ID does not exist' })
		return
	}

	const { title, description } = validateBody(req.body)
	if (!title && !description) {
		res.status(400)
		res.send({ message: 'please provide a valid title or description' })
		return
	}

	const updateFields: { title?: string; description?: string } = {}
	if (title) {
		updateFields.title = title
	}
	if (description) {
		updateFields.description = description
	}

	const doesTheTaskExist = await taskRepository.findTask(id, sessionId)

	if (!doesTheTaskExist) {
		res.status(404)
		res.send({ message: 'the task with the specified ID does not exist' })
		return
	}

	const updatedTask = await taskRepository.updateTask({
		id,
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
}

function validateParams(params: unknown) {
	try {
		const UpdateTasksParamsSchema = z.object({
			id: z.string().min(1),
		})
		const { id } = UpdateTasksParamsSchema.parse(params)
		return { id }
	} catch (error) {
		return {}
	}
}

function validateBody(body: unknown) {
	try {
		const UpdateTasksBodySchema = z.object({
			title: z.string().min(1),
			description: z.string().min(1),
		})
		const { title, description } = UpdateTasksBodySchema.parse(body)
		return { title, description }
	} catch (error) {
		return {}
	}
}
