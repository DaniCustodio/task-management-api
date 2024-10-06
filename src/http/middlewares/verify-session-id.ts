import type { FastifyReply, FastifyRequest } from 'fastify'

export async function verifySessionId(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const sessionId = request.cookies.sessionId

	if (!sessionId) {
		reply.status(401).send({ message: 'Unauthorized' })
		return
	}
}
