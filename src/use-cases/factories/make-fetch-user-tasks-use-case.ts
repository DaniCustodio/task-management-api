import { PrismaTasksRepository } from '@/repositories/prisma/prisma-tasks-repository'
import { FetchUserTasksUseCase } from '../fetch-user-tasks'

export function makeFetchUserTasksUseCase() {
	const repository = new PrismaTasksRepository()
	const useCase = new FetchUserTasksUseCase(repository)

	return useCase
}
