import cookie from '@fastify/cookie'
import Fastify from 'fastify'
import { tasksRoute } from './api/tasks/route'

export const app = Fastify({ logger: true })

app.register(cookie)

app.register(tasksRoute, { prefix: '/api/tasks' })
