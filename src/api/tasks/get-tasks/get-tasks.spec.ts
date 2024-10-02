import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'
import {
	type Mocked,
	afterAll,
	beforeAll,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { createApp } from '../../../app'
import type { TaskRepo } from '../repository'
import { getTasksRoute } from './get-tasks'

describe('get-tasks', () => {
	const URL = '/api/tasks'
	const cookies =
		'sessionId=2e66e4c8-64c1-4162-acd3-9cadf8ae1a0e; Max-Age=604800; Path=/; HttpOnly'
	let sut: ReturnType<typeof createApp>
	let repository: Mocked<TaskRepo>

	beforeAll(async () => {
		repository = {
			createTask: vi.fn(),
			findByTitle: vi.fn(),
			findByDescription: vi.fn(),
			findBySessionId: vi.fn(),
			findTask: vi.fn(),
			updateTask: vi.fn(),
		} as Mocked<TaskRepo>

		const route = async (app: FastifyInstance) => {
			await getTasksRoute(app, repository)
		}

		sut = createApp([
			{
				route,
				prefix: URL,
			},
		])

		await sut.ready()
	})

	afterAll(async () => {
		await sut.close()
	})

	it('can return all tasks by a user', async () => {
		repository.findBySessionId.mockResolvedValue([
			{
				id: '83fb772e-d1cd-4c4d-8f0f-5507ee1db06c',
				session_id: '2e66e4c8-64c1-4162-acd3-9cadf8ae1a0e',
				title: 'Buy milk',
				description: 'Milk is the best drink',
				completed_at: null,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: '435fb772e-d1cd-4c4d-8f0f-4507ee1db06c',
				session_id: '2e66e4c8-64c1-4162-acd3-9cadf8ae1a0e',
				title: 'Buy bread',
				description: 'Bread is the best food',
				completed_at: null,
				created_at: new Date(),
				updated_at: new Date(),
			},
		])

		await request(sut.server)
			.get(URL)
			.set('Cookie', cookies)
			.expect(200)
			.then((response) => {
				const { data } = response.body
				expect(data.length).toBe(2)
			})
	})

	it('should not return the tasks when the user does not have a session id', async () => {
		await request(sut.server)
			.get(URL)
			.expect(401)
			.then((response) => {
				const { message } = response.body
				expect(message).toBe('Unauthorized')
			})
	})

	it('can search tasks by title', async () => {
		repository.findByTitle.mockResolvedValue([
			{
				id: '83fb772e-d1cd-4c4d-8f0f-5507ee1db06c',
				session_id: '2e66e4c8-64c1-4162-acd3-9cadf8ae1a0e',
				title: 'Buy milk',
				description: 'Milk is the best drink',
				completed_at: null,
				created_at: new Date(),
				updated_at: new Date(),
			},
		])

		await request(sut.server)
			.get(URL)
			.set('Cookie', cookies)
			.query({ title: 'Buy milk' })
			.expect(200)
			.then((response) => {
				const { data } = response.body
				expect(data.length).toBe(1)
			})
	})

	it('can search tasks by description', async () => {
		repository.findByDescription.mockResolvedValue([
			{
				id: '83fb772e-d1cd-4c4d-8f0f-5507ee1db06c',
				session_id: '2e66e4c8-64c1-4162-acd3-9cadf8ae1a0e',
				title: 'Buy milk',
				description: 'Milk is the best drink',
				completed_at: null,
				created_at: new Date(),
				updated_at: new Date(),
			},
		])

		await request(sut.server)
			.get(URL)
			.set('Cookie', cookies)
			.query({ description: 'Milk is the best drink' })
			.expect(200)
			.then((response) => {
				const { data } = response.body
				expect(data.length).toBe(1)
			})
	})

	it('should return a empty array when no tasks are found', async () => {
		repository.findByTitle.mockResolvedValue([])

		await request(sut.server)
			.get(URL)
			.set('Cookie', cookies)
			.query({ title: 'Organize the garage' })
			.expect(200)
			.then((response) => {
				const { data } = response.body
				expect(data.length).toBe(0)
			})
	})
})
