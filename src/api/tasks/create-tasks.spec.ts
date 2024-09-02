import { execSync } from 'node:child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../app'

describe('create-tasks', () => {
	const URL = '/api/tasks'

	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	beforeEach(async () => {
		execSync('npm run knex migrate:rollback --all')
		execSync('npm run knex migrate:latest')
	})

	it('can create a task', async () => {
		await request(app.server)
			.post(URL)
			.send({ title: 'Buy milk', description: 'Milk is expensive' })
			.expect(201)
			.then((response) => {
				expect(response.body.data.title).toBe('Buy milk')
				expect(response.body.data.description).toBe('Milk is expensive')
				expect(response.body.data.id).toBeDefined()
				expect(response.body.data.created_at).toBeDefined()
				expect(response.body.data.updated_at).toBeDefined()
				expect(response.body.data.completed_at).toBeNull()
			})
	})

	it('should not create a task with missing title', async () => {
		await request(app.server)
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
		await request(app.server)
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
