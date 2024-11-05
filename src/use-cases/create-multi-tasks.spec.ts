import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks-repository'
import type { TaskRepository } from '@/repositories/tasks-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateMultipleTasksUseCase } from './create-multi-tasks'

const list = [
	{ title: 'Task 1', description: 'Description 1' },
	{ title: 'Task 2', description: 'Description 2' },
	{ title: 'Task 3', description: 'Description 3' },
]

describe('Create Multiple Tasks Use Case', () => {
	let sut: CreateMultipleTasksUseCase
	let repository: TaskRepository

	beforeEach(() => {
		repository = new InMemoryTasksRepository()
		sut = new CreateMultipleTasksUseCase(repository)
	})

	it('should create multiple tasks', async () => {
		const { tasks } = await sut.execute({ data: { list, sessionId: '123' } })

		expect(tasks.length).toEqual(3)
	})
})
