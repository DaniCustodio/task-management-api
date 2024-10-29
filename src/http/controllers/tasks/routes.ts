import { verifySessionId } from '@/http/middlewares/verify-session-id'
import type { FastifyInstance } from 'fastify'
import { create } from './create'
import { update } from './update'
import { search } from './search'

export async function tasksRoute(app: FastifyInstance) {
	app.post('/', create)

	//** Authenticated Routes **//
	app.put('/:id', { onRequest: [verifySessionId] }, update)
	app.get('/', { onRequest: [verifySessionId] }, search)
}
