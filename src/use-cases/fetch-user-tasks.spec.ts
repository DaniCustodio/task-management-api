import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks-repository'
import type { TaskRepository } from '@/repositories/tasks-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchUserTasksUseCase } from './fetch-user-tasks'

describe('Fetch User Tasks Use Case', () => {
	let taskRepository: TaskRepository
	let sut: FetchUserTasksUseCase

	beforeEach(() => {
		taskRepository = new InMemoryTasksRepository()
		sut = new FetchUserTasksUseCase(taskRepository)
	})

	it('should fetch all the user tasks', async () => {
		for (let i = 0; i < 10; i++) {
			await taskRepository.create({
				id: i.toString(),
				title: `Task ${i}`,
				description: `Description ${i}`,
				session_id: '123',
			})
		}

		const { tasks } = await sut.execute({
			sessionId: '123',
		})

		expect(tasks.length).toEqual(10)
	})
	it('should return an empty array if no tasks are found', async () => {
		const { tasks } = await sut.execute({
			sessionId: '123',
		})

		expect(tasks.length).toEqual(0)
	})
	it('should return a empty array if the session id does not exist', async () => {
		await taskRepository.create({
			id: '123',
			title: 'title',
			description: 'description',
			session_id: '123',
		})

		const { tasks } = await sut.execute({
			sessionId: '456',
		})

		expect(tasks.length).toEqual(0)
	})
})
