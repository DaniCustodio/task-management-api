import { app } from '@/app'
import { createCompletedTask, createTask } from '@/utils/test/create-task'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Toggle Complete Task (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should mark a task as completed', async () => {
		const { cookies, taskId } = await createTask()

		const response = await request(app.server)
			.patch(`/api/tasks/${taskId}/complete`)
			.set('Cookie', cookies)
			.send()

		expect(response.status).toBe(200)
		expect(response.body.data.completed_at).toBeDefined()
	})

	it('should mark a task as incomplete', async () => {
		const { cookies, taskId } = await createCompletedTask()

		const response = await request(app.server)
			.patch(`/api/tasks/${taskId}/complete`)
			.set('Cookie', cookies)
			.send()

		expect(response.status).toBe(200)
		expect(response.body.data.completed_at).toBeNull()
	})
})
