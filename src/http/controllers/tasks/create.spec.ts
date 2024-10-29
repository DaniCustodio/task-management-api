import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Task (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should create a task', async () => {
		const response = await request(app.server).post('/api/tasks').send({
			title: 'Test Task',
			description: 'Test Task Description',
		})

		expect(response.status).toBe(201)
		expect(response.body.data).toHaveProperty('id')
	})
})
