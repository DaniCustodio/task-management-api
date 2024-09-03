import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { db } from '../../database/db'
import type { Task } from '../tasks/route'

export async function getTasks(req: FastifyRequest, res: FastifyReply) {
	try {
		const sessionId = req.cookies.sessionId
		if (!sessionId) {
			res.status(401)
			res.send({ message: 'Unauthorized' })
			return
		}

		// QUESTION: If the users sends a title and description, should we search for both?
		// QUESTION: Should we do a fuzzy search?
		const { title, description } = validateParams(req.query)
		if (title) {
			const tasks = await db<Task>('tasks').where({ title })
			res.status(200).send({ data: tasks })
			return
		}

		if (description) {
			const tasks = await db<Task>('tasks').where({ description })
			res.status(200).send({ data: tasks })
			return
		}

		const tasks = await db<Task>('tasks').where({ session_id: sessionId })

		res.status(200).send({ data: tasks })
	} catch (error) {
		console.log('🚨 ERROR', error)
		res.status(500).send({ message: 'Internal server error' })
	}
}

function validateParams(params: unknown) {
	try {
		const GetTasksParamsSchema = z.object({
			title: z.string().min(1).optional(),
			description: z.string().min(1).optional(),
		})

		const { title, description } = GetTasksParamsSchema.parse(params)

		return { title, description }
	} catch (error) {
		return {}
	}
}
