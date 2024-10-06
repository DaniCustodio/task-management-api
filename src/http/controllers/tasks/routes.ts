import type { FastifyInstance } from 'fastify'
import { create } from './create'

export async function tasksRoute(app: FastifyInstance) {
	app.post('/', create)
}
