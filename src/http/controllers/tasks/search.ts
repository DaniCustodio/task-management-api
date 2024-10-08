import { makeFetchUserTasksUseCase } from '@/use-cases/factories/make-fetch-user-tasks-use-case'
import { makeSearchTaskUseCase } from '@/use-cases/factories/make-search-task-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function search(request: FastifyRequest, reply: FastifyReply) {
	const searchParamsSchema = z.object({
		title: z.string().min(1).optional(),
		description: z.string().min(1).optional(),
	})

	const { title, description } = searchParamsSchema.parse(request.query)

	const searchCookiesSchema = z.object({
		sessionId: z.string().uuid(),
	})

	const { sessionId } = searchCookiesSchema.parse(request.cookies)

	if (!title && !description) {
		const fetchUserTasksUseCase = makeFetchUserTasksUseCase()
		const { tasks } = await fetchUserTasksUseCase.execute({
			sessionId,
		})

		reply.status(200).send({ data: tasks })
	}

	const searchUseCase = makeSearchTaskUseCase()
	const { tasks } = await searchUseCase.execute({
		sessionId,
		title,
		description,
	})

	reply.status(200).send({ data: tasks })
}
