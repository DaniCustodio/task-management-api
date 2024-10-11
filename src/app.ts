import cookie from '@fastify/cookie'
import Fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { tasksRoute } from './http/controllers/tasks/routes'

export const app = Fastify({ logger: true })
app.register(cookie)

app.register(tasksRoute, { prefix: '/api/tasks' })

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: 'Validation error.', issues: error.format() })
	}

	if (env.NODE_ENV !== 'production') {
		console.error(error)
	} else {
		// TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
	}

	return reply.status(500).send({ message: 'Internal server error.' })
})
