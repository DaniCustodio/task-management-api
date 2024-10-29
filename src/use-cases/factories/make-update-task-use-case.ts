import { PrismaTasksRepository } from '@/repositories/prisma/prisma-tasks-repository'
import { UpdateTaskUseCase } from '../update-task'

export function makeUpdateTaskUseCase() {
	const repository = new PrismaTasksRepository()
	const useCase = new UpdateTaskUseCase(repository)

	return useCase
}
