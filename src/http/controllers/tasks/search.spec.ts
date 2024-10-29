import { app } from '@/app'
import { createTask } from '@/utils/test/create-task'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Task (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should return the user tasks', async () => {
		const { cookies } = await createTask()

		const response = await request(app.server)
			.get('/api/tasks')
			.set('Cookie', cookies)

		expect(response.status).toBe(200)
		expect(response.body.data).toHaveLength(1)
	})

	it('should search a task by title', async () => {
		const { cookies } = await createTask()

		const response = await request(app.server)
			.get('/api/tasks?title=Test Task')
			.set('Cookie', cookies)

		expect(response.status).toBe(200)
		expect(response.body.data).toHaveLength(1)
	})

	it('should search a task by description', async () => {
		const { cookies } = await createTask()

		const response = await request(app.server)
			.get('/api/tasks?description=Test Task Description')
			.set('Cookie', cookies)

		expect(response.status).toBe(200)
		expect(response.body.data).toHaveLength(1)
	})
})
