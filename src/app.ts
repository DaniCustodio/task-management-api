import cookie from '@fastify/cookie'
import Fastify, { type FastifyInstance } from 'fastify'
import { tasksRoute } from './http/controllers/tasks/routes'

export const app = createApp([{ route: tasksRoute, prefix: '/api/tasks' }])

interface Route {
	route: (app: FastifyInstance) => void
	prefix: string
}

export function createApp(routes: Route[]) {
	const app = Fastify({ logger: true })
	app.register(cookie)

	for (const route of routes) {
		app.register(route.route, { prefix: route.prefix })
	}

	return app
}
