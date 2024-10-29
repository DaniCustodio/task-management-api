import type { TaskRepository } from '@/repositories/tasks-repository'
import type { Task } from '@/types'

interface SearchTasksUseCaseRequest {
	sessionId: string
	title?: string
	description?: string
}

interface SearchTasksUseCaseResponse {
	tasks: Task[]
}

export class SearchTasksUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute({
		title,
		description,
		sessionId,
	}: SearchTasksUseCaseRequest): Promise<SearchTasksUseCaseResponse> {
		if (title) {
			const tasks = await this.taskRepository.findByTitle({ title, sessionId })
			return { tasks }
		}

		if (description) {
			const tasks = await this.taskRepository.findByDescription({
				description,
				sessionId,
			})

			return { tasks }
		}

		return { tasks: [] }
	}
}
