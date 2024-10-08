import { KyselyTasksRepository } from '@/repositories/kysely/kysely-tasks-repository'
import { SearchTasksUseCase } from '../search-task'

export function makeSearchTaskUseCase() {
	const repository = new KyselyTasksRepository()
	const useCase = new SearchTasksUseCase(repository)

	return useCase
}
