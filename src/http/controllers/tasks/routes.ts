import { verifySessionId } from '@/http/middlewares/verify-session-id'
import type { FastifyInstance } from 'fastify'
import { create } from './create'
import { deleteTask } from './delete'
import { search } from './search'
import { update } from './update'

export async function tasksRoute(app: FastifyInstance) {
	app.post('/', create)

	//** Authenticated Routes **//
	app.put('/:id', { onRequest: [verifySessionId] }, update)
	app.get('/', { onRequest: [verifySessionId] }, search)
	app.delete('/:id', { onRequest: [verifySessionId] }, deleteTask)
}
