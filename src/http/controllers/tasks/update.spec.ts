import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Update Task (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should update a task', async () => {
		const response = await request(app.server)
			.put('/api/tasks/83fb772e-d1cd-4c4d-8f0f-9807ee1db06c')
			.set('Cookie', ['sessionId=83fb772e-d1cd-4c4d-8f0f-5507ee1db06c'])
			.send({
				title: 'Test Task',
				description: 'Test Task Description',
			})

		expect(response.status).toBe(200)
		expect(response.body.data.title).toBe('Test Task')
		expect(response.body.data.description).toBe('Test Task Description')
	})

	it('should not update a task without a title or description', async () => {
		const response = await request(app.server)
			.put('/api/tasks/83fb772e-d1cd-4c4d-8f0f-9807ee1db06c')
			.set('Cookie', ['sessionId=83fb772e-d1cd-4c4d-8f0f-5507ee1db06c'])
			.send({
				title: '',
				description: '',
			})

		expect(response.status).toBe(400)
		expect(response.body.data.error).toBe('Missing title or description')
	})
})
