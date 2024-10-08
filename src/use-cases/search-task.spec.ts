import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks-repository'
import type { TaskRepository } from '@/repositories/tasks-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchTasksUseCase } from './search-task'

describe('Search Tasks Use Case', () => {
	let taskRepository: TaskRepository
	let sut: SearchTasksUseCase

	beforeEach(() => {
		taskRepository = new InMemoryTasksRepository()
		sut = new SearchTasksUseCase(taskRepository)
	})

	it('should return a task by title', async () => {
		await taskRepository.create({
			id: '123',
			title: 'title',
			description: 'description',
			session_id: '123',
		})

		const { tasks } = await sut.execute({
			sessionId: '123',
			title: 'title',
		})

		expect(tasks.length).toEqual(1)
	})
	it('should return a task by description', async () => {
		await taskRepository.create({
			id: '123',
			title: 'title',
			description: 'description',
			session_id: '123',
		})

		const { tasks } = await sut.execute({
			sessionId: '123',
			description: 'description',
		})

		expect(tasks.length).toEqual(1)
	})
	it('should return an empty array if the session id does not exist', async () => {
		await taskRepository.create({
			id: '123',
			title: 'title',
			description: 'description',
			session_id: '123',
		})

		const { tasks } = await sut.execute({
			sessionId: '456',
			title: 'title',
		})

		expect(tasks.length).toEqual(0)
	})
	it('should return an empty array if no tasks are found', async () => {
		const { tasks } = await sut.execute({
			sessionId: '123',
			title: 'title',
		})

		expect(tasks.length).toEqual(0)
	})
	it('should search by title when title and description are provided', async () => {
		await taskRepository.create({
			id: '123',
			title: 'title',
			description: 'description',
			session_id: '123',
		})

		await taskRepository.create({
			id: '321',
			title: 'title',
			description: 'new description',
			session_id: '123',
		})

		const { tasks } = await sut.execute({
			sessionId: '123',
			title: 'title',
			description: 'new description',
		})

		expect(tasks.length).toEqual(2)
	})
})
