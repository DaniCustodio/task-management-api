import type { TaskRepository } from '@/repositories/tasks-repository'
import type { Task } from '@/types'

type DeleteTaskRequest = {
	id: string
	sessionId: string
}

type DeleteTaskResponse = {
	task: Task
}

export class DeleteTasksUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute({
		id,
		sessionId,
	}: DeleteTaskRequest): Promise<DeleteTaskResponse> {
		const task = await this.taskRepository.delete({ id, sessionId })

		if (!task) {
			throw new Error('Task not found')
		}

		return {
			task,
		}
	}
}
