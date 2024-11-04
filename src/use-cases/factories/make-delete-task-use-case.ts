import { PrismaTasksRepository } from '@/repositories/prisma/prisma-tasks-repository'
import { DeleteTasksUseCase } from '../delete-task'

export function makeDeleteTaskUseCase() {
	const repository = new PrismaTasksRepository()
	const useCase = new DeleteTasksUseCase(repository)

	return useCase
}
