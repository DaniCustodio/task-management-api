import { KyselyTasksRepository } from '@/repositories/kysely/kysely-tasks-repository'
import { UpdateTaskUseCase } from '../update-task'

export function makeUpdateTaskUseCase() {
	const repository = new KyselyTasksRepository()
	const useCase = new UpdateTaskUseCase(repository)

	return useCase
}
