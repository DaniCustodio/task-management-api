import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Multiple Tasks (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should create multiple tasks', async () => {
		const filePath = './src/utils/test/tasks-example.csv'

		const response = await request(app.server)
			.post('/api/tasks/multi')
			.attach('file', filePath)

		expect(response.status).toBe(201)
		expect(response.body.data.length).toBe(5)
	})
})
