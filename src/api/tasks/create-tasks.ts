import { randomUUID } from 'node:crypto'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { type ZodObject, z } from 'zod'
import { db } from '../../database/db'
import type { Task } from '../tasks/route'

export async function createTasks(req: FastifyRequest, res: FastifyReply) {
	try {
		const { title, description } = validateBody(req.body)
		if (!title || !description) {
			res.status(400)
			res.send({ message: 'please provide a valid title and description' })
			return
		}

		let sessionId = req.cookies.sessionId
		if (!sessionId) {
			sessionId = randomUUID()
			res.setCookie('sessionId', sessionId, {
				path: '/',
				httpOnly: true,
				maxAge: 60 * 60 * 24 * 7,
			})
		}

		const result = await db<Task>('tasks').returning('*').insert({
			id: randomUUID(),
			session_id: sessionId,
			title,
			description,
		})

		res.status(201)
		res.send({ data: result[0] })
	} catch (error) {
		console.log(error)
		res.status(500)
		res.send({ message: 'Internal server error' })
	}
}

function validateBody(body: unknown) {
	try {
		const createTaskSchema = z.object({
			title: z.string().min(1),
			description: z.string().min(1),
		})

		const { title, description } = createTaskSchema.parse(body)

		return { title, description }
	} catch (error) {
		return {}
	}
}
