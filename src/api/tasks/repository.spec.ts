import { execSync } from 'node:child_process'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { db } from '../../database/db'
import { TaskRepository } from './repository'

describe('task-repository', () => {
	const sut = new TaskRepository(db)

	beforeAll(async () => {
		execSync('npm run migrate:latest')
		execSync('npm run seed:test')
	})

	afterAll(async () => {
		execSync('npm run migrate:rollback')
	})

	it('should find a task by title', async () => {
		const result = await sut.findByTitle(
			'Buy milk',
			'83fb772e-d1cd-4c4d-8f0f-5507ee1db06c'
		)

		expect(result.length).toBe(1)
	})

	it('should NOT find a task with a invalid session id', async () => {
		const result = await sut.findByTitle(
			'Buy milk',
			'83fb772e-d1cd-4c4d-7f0f-5507ee1db06c'
		)

		expect(result.length).toBe(0)
	})

	it('should find a task by description', async () => {
		const result = await sut.findByDescription(
			'Milk is the best drink',
			'83fb772e-d1cd-4c4d-8f0f-5507ee1db06c'
		)

		expect(result.length).toBe(1)
	})

	it('should NOT find a task with a invalid session id', async () => {
		const result = await sut.findByDescription(
			'Milk is the best drink',
			'83fb772e-d1cd-4c4d-7f0f-5507ee1db06c'
		)

		expect(result.length).toBe(0)
	})

	it('should find a task by session id', async () => {
		const result = await sut.findBySessionId(
			'83fb772e-d1cd-4c4d-8f0f-5507ee1db06c'
		)

		expect(result.length).toBe(2)
	})

	it('should find a task by id', async () => {
		const result = await sut.findTask(
			'83fb772e-d1cd-4c4d-8f0f-3b07ee1db06c',
			'83fb772e-d1cd-4c4d-8f0f-5507ee1db06c'
		)

		expect(result).toBeDefined()
	})

	it('should NOT find a task by id with a invalid session id', async () => {
		const result = await sut.findTask(
			'83fb772e-d1cd-4c4d-8f0f-3b07ee1db06c',
			'83fb772e-d1cd-4c4d-8f0f-3407ee1db06c'
		)

		expect(result).toBeUndefined()
	})

	it('should update a task', async () => {
		const result = await sut.updateTask({
			id: '435fb772e-d1cd-34c4d-8f0f-4507ee1db06c',
			session_id: '76364e2e-d1cd-v7c4d-8f0f-3407ee1db06c',
			updateFields: {
				title: 'Buy chocolate',
				description: 'Chocolate is the best food',
			},
		})

		expect(result.title).toBe('Buy chocolate')
		expect(result.description).toBe('Chocolate is the best food')
	})

	it('should update only the title of a task', async () => {
		const result = await sut.updateTask({
			id: '83fb772e-d1cd-4c4d-8f0f-9807ee1db06c',
			session_id: '83fb772e-d1cd-4c4d-8f0f-5507ee1db06c',
			updateFields: {
				title: 'Buy 12 eggs',
			},
		})

		expect(result.title).toBe('Buy 12 eggs')
		expect(result.description).toBe('Eggs are the best food')
	})

	it('should update only the description of a task', async () => {
		const result = await sut.updateTask({
			id: '435fb772e-d1cd-4c4d-8f0f-4507ee1db06c',
			session_id: '76364e2e-d1cd-4c4d-8f0f-3407ee1db06c',
			updateFields: {
				description: 'We do not have bread',
			},
		})

		expect(result.title).toBe('Buy bread')
		expect(result.description).toBe('We do not have bread')
	})

	it('should create a task', async () => {
		const result = await sut.createTask({
			id: '337fb772e-d1cd-4c4d-8f0f-4507ee1db06c',
			sessionId: '76364e2e-d1cd-4c4d-8f0f-3407ee1db06c',
			title: 'Buy bananas',
			description: 'Bananas are the best food',
		})

		expect(result.title).toBe('Buy bananas')
		expect(result.description).toBe('Bananas are the best food')
	})
})
