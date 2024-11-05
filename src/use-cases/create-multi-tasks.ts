import { randomUUID } from 'node:crypto'
import type { TaskRepository } from '@/repositories/tasks-repository'
import type { Task } from '@/types'

interface CreateMultipleTasksUseCaseRequest {
	data: {
		list: {
			title: string
			description: string
		}[]
		sessionId: string
	}
}

interface CreateMultipleTasksUseCaseResponse {
	tasks: Task[]
}

export class CreateMultipleTasksUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute({
		data,
	}: CreateMultipleTasksUseCaseRequest): Promise<CreateMultipleTasksUseCaseResponse> {
		const tasksWithId = data.list.map((task) => ({
			...task,
			id: randomUUID(),
			session_id: data.sessionId,
		}))

		const tasks = await this.taskRepository.createMany(tasksWithId)

		return { tasks }
	}
}
