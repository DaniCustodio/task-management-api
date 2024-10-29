import { PrismaTasksRepository } from '@/repositories/prisma/prisma-tasks-repository'
import { CreateTaskUseCase } from '../create-task'

export function makeCreateTaskUseCase() {
	const repository = new PrismaTasksRepository()
	const useCase = new CreateTaskUseCase(repository)

	return useCase
}
