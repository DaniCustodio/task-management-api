import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks-repository'
import type { TaskRepository } from '@/repositories/tasks-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateTaskUseCase } from './create-task'

describe('Create Task Use Case', () => {
	let taskRepository: TaskRepository
	let sut: CreateTaskUseCase

	beforeEach(() => {
		taskRepository = new InMemoryTasksRepository()
		sut = new CreateTaskUseCase(taskRepository)
	})

	it('should create a task', async () => {
		const { task } = await sut.execute({
			sessionId: '123',
			title: 'title',
			description: 'description',
		})

		expect(task.id).toEqual(expect.any(String))
		expect(task.completed_at).toBeNull()
	})
})
