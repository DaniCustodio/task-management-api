import { KyselyTasksRepository } from '@/repositories/kysely/kysely-tasks-repository'
import { FetchUserTasksUseCase } from '@/use-cases/fetch-user-tasks'
import { SearchTasksUseCase } from '@/use-cases/search-task'
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
		const fetchUserTasksUseCase = new FetchUserTasksUseCase(
			new KyselyTasksRepository()
		)
		const { tasks } = await fetchUserTasksUseCase.execute({
			sessionId,
		})

		reply.status(200).send({ data: tasks })
	}

	const searchUseCase = new SearchTasksUseCase(new KyselyTasksRepository())
	const { tasks } = await searchUseCase.execute({
		sessionId,
		title,
		description,
	})

	reply.status(200).send({ data: tasks })
}
