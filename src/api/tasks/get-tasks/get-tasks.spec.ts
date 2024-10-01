import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'

describe('get-tasks', () => {
	const URL = '/api/tasks'
	let cookies: string

	beforeAll(async () => {
		await app.ready()

		await request(app.server)
			.post(URL)
			.send({ title: 'Buy milk', description: 'Milk is expensive' })
			.then((response) => {
				cookies = response.headers['set-cookie']
			})
		await request(app.server)
			.post(URL)
			.set('Cookie', cookies)
			.send({ title: 'Build the lego', description: 'Legos are fun' })
	})

	afterAll(async () => {
		await app.close()
	})

	it('can return all tasks by a user', async () => {
		await request(app.server)
			.get(URL)
			.set('Cookie', cookies)
			.expect(200)
			.then((response) => {
				expect(response.body.data.length).toBe(2)
			})
	})
	it('should not return the tasks when the user does not have a session id', async () => {
		await request(app.server).get(URL).expect(401)
	})

	it('can search tasks by title', async () => {
		await request(app.server)
			.get(URL)
			.set('Cookie', cookies)
			.query({ title: 'Buy milk' })
			.expect(200)
			.then((response) => {
				expect(response.body.data.length).toBe(1)
			})
	})
	it('can search tasks by description', async () => {
		await request(app.server)
			.get(URL)
			.set('Cookie', cookies)
			.query({ description: 'Legos are fun' })
			.expect(200)
			.then((response) => {
				expect(response.body.data.length).toBe(1)
			})
	})
	it('should return a empty array when no tasks are found', async () => {
		await request(app.server)
			.get(URL)
			.set('Cookie', cookies)
			.query({ title: 'Organize the garage' })
			.expect(200)
			.then((response) => {
				expect(response.body.data.length).toBe(0)
			})
	})
})
