import { PrismaTasksRepository } from '@/repositories/prisma/prisma-tasks-repository'
import { SearchTasksUseCase } from '../search-task'

export function makeSearchTaskUseCase() {
	const repository = new PrismaTasksRepository()
	const useCase = new SearchTasksUseCase(repository)

	return useCase
}
