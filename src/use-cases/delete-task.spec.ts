import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks-repository'
import type { TaskRepository } from '@/repositories/tasks-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteTasksUseCase } from './delete-task'

describe('Delete Task Use Case', () => {
	let taskRepository: TaskRepository
	let sut: DeleteTasksUseCase

	beforeEach(() => {
		taskRepository = new InMemoryTasksRepository()
		sut = new DeleteTasksUseCase(taskRepository)
	})

	it('should delete a task', async () => {
		await taskRepository.create({
			id: '123',
			title: 'title',
			description: 'description',
			session_id: '123',
		})

		const { task } = await sut.execute({
			sessionId: '123',
			id: '123',
		})

		expect(task.id).toEqual('123')
	})

	it('should throw an error if the session id does not exist', async () => {
		expect(
			sut.execute({
				sessionId: '456',
				id: '123',
			})
		).rejects.toThrowError('Task not found')
	})

	it('should throw an error if the task does not exist', async () => {
		expect(
			sut.execute({
				sessionId: '123',
				id: '456',
			})
		).rejects.toThrowError('Task not found')
	})
})
