import { randomUUID } from 'node:crypto'
import type { TaskRepository } from '@/repositories/tasks-repository'
import type { Task } from '@/types'

interface CreateMultipleTasksUseCaseRequest {
	listOfTasks: {
		title: string
		description: string
	}[]
	sessionId: string
}

interface CreateMultipleTasksUseCaseResponse {
	tasks: Task[]
}

export class CreateMultipleTasksUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute({
		listOfTasks,
		sessionId,
	}: CreateMultipleTasksUseCaseRequest): Promise<CreateMultipleTasksUseCaseResponse> {
		const tasksWithId = listOfTasks.map((task) => ({
			...task,
			id: randomUUID(),
			session_id: sessionId,
		}))

		const tasks = await this.taskRepository.createMany(tasksWithId)

		return { tasks }
	}
}
