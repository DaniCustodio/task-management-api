import { makeCompleteTaskUseCase } from '@/use-cases/factories/make-complete-task-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function toggleComplete(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const paramsSchema = z
		.object({
			id: z.string().uuid(),
		})
		.required()

	const cookiesSchema = z
		.object({
			sessionId: z.string().uuid(),
		})
		.required()

	const { id } = paramsSchema.parse(request.params)

	const { sessionId } = cookiesSchema.parse(request.cookies)

	const useCase = makeCompleteTaskUseCase()

	const { task } = await useCase.execute({
		sessionId,
		id,
	})

	reply.status(200).send({ data: task })
}
