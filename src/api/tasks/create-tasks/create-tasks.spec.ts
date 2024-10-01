import type { FastifyInstance } from 'fastify'
import request from 'supertest'
import {
	type Mocked,
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { type CreateTask, createTasksRoute } from '.'
import { createApp } from '../../../app'
import type { TaskRepo } from '../repository'

describe('create-tasks', () => {
	const URL = '/api/tasks'
	let sut: ReturnType<typeof createApp>
	let repository: Mocked<TaskRepo>
	const testTask: CreateTask = {
		id: '337fb772e-d1cd-4c4d-8f0f-4507ee1db06c',
		sessionId: '76364e2e-d1cd-4c4d-8f0f-3407ee1db06c',
		title: 'Buy bananas',
		description: 'Bananas are the best food',
	}

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
			await createTasksRoute(app, repository)
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

	it('can create a task', async () => {
		repository.createTask.mockResolvedValue({
			...testTask,
			session_id: '337fb772e-d1cd-4c4d-8f0f-4507ee1db06c',
			completed_at: null,
			created_at: new Date(),
			updated_at: new Date(),
		})

		await request(sut.server)
			.post(URL)
			.send({ ...testTask })
			.expect(201)
			.then((response) => {
				const { data, message } = response.body
				expect(data).toBeDefined()
				expect(message).toBeUndefined()
			})
	})

	it('should not create a task with missing title', async () => {
		await request(sut.server)
			.post(URL)
			.send({ description: 'Milk is expensive' })
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe(
					'please provide a valid title and description'
				)
			})
	})

	it('should not create a task with missing description', async () => {
		await request(sut.server)
			.post(URL)
			.send({ title: 'Buy milk' })
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe(
					'please provide a valid title and description'
				)
			})
	})
})
