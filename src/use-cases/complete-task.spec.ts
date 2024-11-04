import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks-repository'
import type { TaskRepository } from '@/repositories/tasks-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CompleteTaskUseCase } from './complete-task'

describe('Complete Task Use Case', () => {
	let taskRepository: TaskRepository
	let sut: CompleteTaskUseCase

	beforeEach(() => {
		taskRepository = new InMemoryTasksRepository()
		sut = new CompleteTaskUseCase(taskRepository)
	})

	it('should mark a task as completed', async () => {
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

		expect(task.completed_at).toBeDefined()
	})
	it('should mark a task as incomplete', async () => {
		await taskRepository.create({
			id: '123',
			title: 'title',
			description: 'description',
			session_id: '123',
			completed_at: new Date().toISOString(),
		})

		const { task } = await sut.execute({
			sessionId: '123',
			id: '123',
		})

		expect(task.completed_at).toBeNull()
	})
	it('should throw an error if the task does not exist', async () => {
		await expect(
			sut.execute({
				sessionId: '123',
				id: '123',
			})
		).rejects.toThrow('Task not found')
	})
})
