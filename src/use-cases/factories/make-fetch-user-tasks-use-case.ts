import { KyselyTasksRepository } from '@/repositories/kysely/kysely-tasks-repository'
import { FetchUserTasksUseCase } from '../fetch-user-tasks'

export function makeFetchUserTasksUseCase() {
	const repository = new KyselyTasksRepository()
	const useCase = new FetchUserTasksUseCase(repository)

	return useCase
}
