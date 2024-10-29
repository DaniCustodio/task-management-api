import { makeUpdateTaskUseCase } from '@/use-cases/factories/make-update-task-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function update(request: FastifyRequest, reply: FastifyReply) {
	const updateParamsSchema = z
		.object({
			id: z.string().uuid(),
		})
		.required()

	const updateCookiesSchema = z
		.object({
			sessionId: z.string().uuid(),
		})
		.required()

	const { id } = updateParamsSchema.parse(request.params)

	const { sessionId } = updateCookiesSchema.parse(request.cookies)

	const updateBodySchema = z.object({
		title: z.string().min(1).optional(),
		description: z.string().min(1).optional(),
	})

	const { title, description } = updateBodySchema.parse(request.body)

	if (!title && !description) {
		reply.status(400).send({ error: 'Missing title or description' })
		return
	}

	const updateUseCase = makeUpdateTaskUseCase()

	const { task } = await updateUseCase.execute({
		sessionId,
		id,
		title,
		description,
	})

	reply.status(200).send({ data: task })
}
