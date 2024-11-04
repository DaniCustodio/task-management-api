import { app } from '@/app'
import { createTask } from '@/utils/test/create-task'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Delete Task (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should delete a user task', async () => {
		const { cookies, taskId } = await createTask()

		const response = await request(app.server)
			.delete(`/api/tasks/${taskId}`)
			.set('Cookie', cookies)

		expect(response.status).toBe(200)
		expect(response.body.data).toHaveProperty('id')
	})
})
