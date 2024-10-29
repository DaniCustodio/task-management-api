import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks-repository'
import type { TaskRepository } from '@/repositories/tasks-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateTaskUseCase } from './update-task'

describe('Update Task Use Case', () => {
	let taskRepository: TaskRepository
	let sut: UpdateTaskUseCase

	beforeEach(() => {
		taskRepository = new InMemoryTasksRepository()
		sut = new UpdateTaskUseCase(taskRepository)
	})

	it('should update a task', async () => {
		await taskRepository.create({
			id: '123',
			title: 'title',
			description: 'description',
			session_id: '123',
		})

		const { task } = await sut.execute({
			sessionId: '123',
			id: '123',
			title: 'New Title',
			description: 'New Description',
		})

		expect(task.title).toEqual('New Title')
		expect(task.description).toEqual('New Description')
	})
	it('should throw an error if the task does not exist', async () => {
		await expect(
			sut.execute({
				sessionId: '123',
				id: '123',
				title: 'Title',
				description: 'Description',
			})
		).rejects.toThrow('Task not found')
	})
	it('should update only the specified fields', async () => {
		await taskRepository.create({
			id: '123',
			title: 'title',
			description: 'description',
			session_id: '123',
		})

		const { task } = await sut.execute({
			sessionId: '123',
			id: '123',
			title: 'New Title',
		})

		expect(task.title).toEqual('New Title')
		expect(task.description).toEqual('description')
	})
})
