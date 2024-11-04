import type { TaskRepository } from '@/repositories/tasks-repository'
import type { Task } from '@/types'

interface CompleteTaskRequest {
	id: string
	sessionId: string
}

interface CompleteTaskResponse {
	task: Task
}

export class CompleteTaskUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute({
		id,
		sessionId,
	}: CompleteTaskRequest): Promise<CompleteTaskResponse> {
		const task = await this.taskRepository.toggleComplete({ id, sessionId })

		if (!task) {
			throw new Error('Task not found')
		}

		return {
			task,
		}
	}
}
