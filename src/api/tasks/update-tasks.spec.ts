import { execSync } from 'node:child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../app'

describe('update-tasks', () => {
	const URL = '/api/tasks'

	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('can update a task', async () => {
		const createTaskResponse = await request(app.server)
			.post(URL)
			.send({ title: 'Buy milk', description: 'Milk is expensive' })

		const cookies = createTaskResponse.get('set-cookie')
		const taskId = createTaskResponse.body.data.id

		await request(app.server)
			.put(`${URL}/${taskId}`)
			.set('Cookie', cookies ?? '')
			.send({
				title: 'Buy coca cola',
				description: 'Coca cola is expensive',
			})
			.expect(200)
			.then((response) => {
				expect(response.body.data.title).toBe('Buy coca cola')
				expect(response.body.data.description).toBe('Coca cola is expensive')
				expect(response.body.data.id).toBeDefined()
				expect(response.body.data.created_at).toBeDefined()
				expect(response.body.data.updated_at).toBeDefined()
				expect(response.body.data.completed_at).toBeNull()
			})
	})
	it('should not update a task with missing or invalid id', async () => {
		const createTaskResponse = await request(app.server)
			.post(URL)
			.send({ title: 'Buy milk', description: 'Milk is expensive' })

		const cookies = createTaskResponse.get('set-cookie')

		await request(app.server)
			.put(`${URL}/1234567890`)
			.set('Cookie', cookies ?? '')
			.send({
				title: 'Buy coca cola',
				description: 'Coca cola is expensive',
			})
			.expect(404)
			.then((response) => {
				expect(response.body.message).toBe(
					'the task with the specified ID does not exist'
				)
			})
	})
	it('should not update a task with missing data', async () => {
		const createTaskResponse = await request(app.server)
			.post(URL)
			.send({ title: 'Buy milk', description: 'Milk is expensive' })

		const cookies = createTaskResponse.get('set-cookie')
		const taskId = createTaskResponse.body.data.id

		await request(app.server)
			.put(`${URL}/${taskId}`)
			.set('Cookie', cookies ?? '')
			.send({})
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe(
					'please provide a valid title or description'
				)
			})
	})
	it('should not update a task with invalid data', async () => {
		const createTaskResponse = await request(app.server)
			.post(URL)
			.send({ title: 'Buy milk', description: 'Milk is expensive' })

		const cookies = createTaskResponse.get('set-cookie')
		const taskId = createTaskResponse.body.data.id

		await request(app.server)
			.put(`${URL}/${taskId}`)
			.set('Cookie', cookies ?? '')
			.send({
				title: '',
			})
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe(
					'please provide a valid title or description'
				)
			})
	})
	it('should not update a task with missing session id', async () => {
		const createTaskResponse = await request(app.server)
			.post(URL)
			.send({ title: 'Buy milk', description: 'Milk is expensive' })

		const taskId = createTaskResponse.body.data.id

		await request(app.server)
			.put(`${URL}/${taskId}`)
			.send({
				title: 'Buy coca cola',
				description: 'Coca cola is expensive',
			})
			.expect(401)
			.then((response) => {
				expect(response.body.message).toBe('please provide a session id')
			})
	})
})
