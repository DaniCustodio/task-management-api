import { randomUUID } from 'node:crypto'
import type { TaskRepository } from '@/repositories/tasks-repository'
import type { Task } from '@/types'

interface CreateTaskUseCaseRequest {
	sessionId: string
	title: string
	description: string
}

interface CreateTaskUseCaseResponse {
	task: Task
}

export class CreateTaskUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute({
		sessionId,
		title,
		description,
	}: CreateTaskUseCaseRequest): Promise<CreateTaskUseCaseResponse> {
		const task = await this.taskRepository.create({
			id: randomUUID(),
			title,
			description,
			session_id: sessionId,
		})

		return { task }
	}
}
