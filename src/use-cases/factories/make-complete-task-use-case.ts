import { PrismaTasksRepository } from '@/repositories/prisma/prisma-tasks-repository'
import { CompleteTaskUseCase } from '../complete-task'

export function makeCompleteTaskUseCase() {
	const repository = new PrismaTasksRepository()
	const useCase = new CompleteTaskUseCase(repository)

	return useCase
}
