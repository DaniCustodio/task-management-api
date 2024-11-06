import { PrismaTasksRepository } from '@/repositories/prisma/prisma-tasks-repository'
import { CreateMultipleTasksUseCase } from '../create-multi-tasks'

export function makeCreateMultiTaskUseCase() {
	const repository = new PrismaTasksRepository()
	const useCase = new CreateMultipleTasksUseCase(repository)

	return useCase
}
