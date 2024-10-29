import { randomUUID } from 'node:crypto'
import { makeCreateTaskUseCase } from '@/use-cases/factories/make-create-task-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createBodySchema = z
		.object({
			title: z.string().min(1),
			description: z.string().min(1),
		})
		.required()

	const { title, description } = createBodySchema.parse(request.body)

	const createUseCase = makeCreateTaskUseCase()

	let sessionId = request.cookies.sessionId
	if (!sessionId) {
		sessionId = randomUUID()
		const sevenDaysInSeconds = 60 * 60 * 24 * 7
		reply.setCookie('sessionId', sessionId, {
			path: '/',
			httpOnly: true,
			maxAge: sevenDaysInSeconds,
		})
	}

	const { task } = await createUseCase.execute({
		sessionId,
		title,
		description,
	})

	reply.status(201).send({ data: task })
}
