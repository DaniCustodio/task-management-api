import { app } from '@/app'
import { createTask } from '@/utils/test/create-task'
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
		const { cookies, taskId } = await createTask()

		const response = await request(app.server)
			.put(`/api/tasks/${taskId}`)
			.set('Cookie', cookies)
			.send({
				title: 'Updated Test Task',
				description: 'Updated Test Task Description',
			})

		expect(response.status).toBe(200)
		expect(response.body.data.title).toBe('Updated Test Task')
		expect(response.body.data.description).toBe('Updated Test Task Description')
	})
})
