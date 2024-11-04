import { makeDeleteTaskUseCase } from '@/use-cases/factories/make-delete-task-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteTask(request: FastifyRequest, reply: FastifyReply) {
	const deleteParamsSchema = z
		.object({
			id: z.string().uuid(),
		})
		.required()

	const deleteCookiesSchema = z
		.object({
			sessionId: z.string().uuid(),
		})
		.required()

	const { id } = deleteParamsSchema.parse(request.params)
	const { sessionId } = deleteCookiesSchema.parse(request.cookies)

	const deleteUseCase = makeDeleteTaskUseCase()

	const { task } = await deleteUseCase.execute({
		sessionId,
		id,
	})

	reply.status(200).send({ data: task })
}
