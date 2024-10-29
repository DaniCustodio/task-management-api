import type { TaskRepository } from '@/repositories/tasks-repository'
import type { Task } from '@/types'

interface UpdateTaskUseCaseRequest {
	sessionId: string
	id: string
	title?: string
	description?: string
}

interface UpdateTaskUseCaseResponse {
	task: Task
}

export class UpdateTaskUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute({
		sessionId,
		id,
		title,
		description,
	}: UpdateTaskUseCaseRequest): Promise<UpdateTaskUseCaseResponse> {
		const task = await this.taskRepository.findById({
			id,
			sessionId,
		})

		if (!task) {
			throw new Error('Task not found')
		}

		const updatedTask = await this.taskRepository.update({
			id,
			session_id: sessionId,
			title,
			description,
		})

		return { task: updatedTask }
	}
}
