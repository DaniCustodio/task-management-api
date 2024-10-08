import { KyselyTasksRepository } from '@/repositories/kysely/kysely-tasks-repository'
import { CreateTaskUseCase } from '../create-task'

export function makeCreateTaskUseCase() {
	const repository = new KyselyTasksRepository()
	const useCase = new CreateTaskUseCase(repository)

	return useCase
}
