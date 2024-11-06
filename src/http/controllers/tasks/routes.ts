import { verifySessionId } from '@/http/middlewares/verify-session-id'
import type { FastifyInstance } from 'fastify'
import multer from 'fastify-multer'
import { toggleComplete } from './complete'
import { create } from './create'
import { createMulti } from './create-multi'
import { deleteTask } from './delete'
import { search } from './search'
import { update } from './update'

const upload = multer({ dest: 'uploads/' })

export async function tasksRoute(app: FastifyInstance) {
	app.post('/', create)
	app.post('/multi', { preHandler: upload.single('file') }, createMulti)

	//** Authenticated Routes **//
	app.put('/:id', { onRequest: [verifySessionId] }, update)
	app.get('/', { onRequest: [verifySessionId] }, search)
	app.delete('/:id', { onRequest: [verifySessionId] }, deleteTask)
	app.patch('/:id/complete', { onRequest: [verifySessionId] }, toggleComplete)
}
