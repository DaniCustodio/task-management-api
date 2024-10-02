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
import type { Task } from '../../../types'
import type { TaskRepo } from '../repository'
import { updateTasksRoute } from './update-tasks'

describe('update-tasks', () => {
	const URL = '/api/tasks'
	const cookies =
		'sessionId=2e66e4c8-64c1-4162-acd3-9cadf8ae1a0e; Max-Age=604800; Path=/; HttpOnly'
	let sut: ReturnType<typeof createApp>
	let repository: Mocked<TaskRepo>
	const testTask: Task = {
		id: '83fb772e-d1cd-4c4d-8f0f-5507ee1db06c',
		session_id: '2e66e4c8-64c1-4162-acd3-9cadf8ae1a0e',
		title: 'Buy bread',
		description: 'Bread is the best food',
		completed_at: null,
		created_at: new Date(),
		updated_at: new Date(),
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

		const route = async (sut: FastifyInstance) => {
			await updateTasksRoute(sut, repository)
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

	it('can update a task', async () => {
		repository.findTask.mockResolvedValue(testTask)
		repository.updateTask.mockResolvedValue({
			...testTask,
			title: 'Buy coca cola',
			description: 'Coca cola is expensive',
		})

		await request(sut.server)
			.put(`${URL}/${testTask.id}`)
			.set('Cookie', cookies)
			.send({
				title: 'Buy coca cola',
				description: 'Coca cola is expensive',
			})
			.expect(200)
			.then((response) => {
				const { data } = response.body
				expect(data).toBeDefined()
			})
	})

	it('should not update a task with missing or invalid id', async () => {
		await request(sut.server)
			.put(`${URL}/1234567890`)
			.set('Cookie', cookies)
			.send({
				title: 'Buy coca cola',
				description: 'Coca cola is expensive',
			})
			.expect(404)
			.then((response) => {
				const { message } = response.body
				expect(message).toBe('the task with the specified ID does not exist')
			})
	})

	it('should not update a task with missing data', async () => {
		await request(sut.server)
			.put(`${URL}/${testTask.id}`)
			.set('Cookie', cookies)
			.send({})
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe(
					'please provide a valid title or description'
				)
			})
	})

	it('should not update a task with invalid data', async () => {
		await request(sut.server)
			.put(`${URL}/${testTask.id}`)
			.set('Cookie', cookies)
			.send({ title: '' })
			.expect(400)
			.then((response) => {
				const { message } = response.body
				expect(message).toBe('please provide a valid title or description')
			})
	})

	it('should not update a task with missing session id', async () => {
		await request(sut.server)
			.put(`${URL}/${testTask.id}`)
			.send({
				title: 'Buy coca cola',
				description: 'Coca cola is expensive',
			})
			.expect(401)
			.then((response) => {
				const { message } = response.body
				expect(message).toBe('please provide a session id')
			})
	})
})
