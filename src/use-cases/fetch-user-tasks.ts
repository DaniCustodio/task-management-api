import type { TaskRepository } from '@/repositories/tasks-repository'
import type { Task } from '@/types'

interface FetchUserTasksUseCaseRequest {
	sessionId: string
}

interface FetchUserTasksUseCaseResponse {
	tasks: Task[]
}

export class FetchUserTasksUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute({
		sessionId,
	}: FetchUserTasksUseCaseRequest): Promise<FetchUserTasksUseCaseResponse> {
		const tasks = await this.taskRepository.findBySessionId(sessionId)

		return { tasks }
	}
}
