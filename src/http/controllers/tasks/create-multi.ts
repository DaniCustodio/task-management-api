import { randomUUID } from 'node:crypto'
import { parseCsv } from '@/services/parse-csv'
import { makeCreateMultiTaskUseCase } from '@/use-cases/factories/make-create-multi-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3
const ACCEPTED_FILE_TYPES = ['text/csv']

interface MulterFile {
	fieldname: string
	originalname: string
	encoding: string
	mimetype: string
	destination: string
	filename: string
	path: string
	size: number
}

interface CustomFastifyRequest extends FastifyRequest {
	file?: MulterFile
}

export async function createMulti(
	request: CustomFastifyRequest,
	reply: FastifyReply
) {
	const fileSchema = z
		.any()
		.refine((file) => {
			return !file || file.size <= MAX_UPLOAD_SIZE
		}, 'File size must be less than 3 MB')
		.refine((file) => {
			return ACCEPTED_FILE_TYPES.includes(file.mimetype)
		}, 'File type must be CSV')

	const file: MulterFile = fileSchema.parse(request.file)
	const parsedTasks = await parseCsv(file.path)

	let sessionId = request.cookies.sessionId
	if (!sessionId) {
		sessionId = randomUUID()
		const sevenDaysInSeconds = 60 * 60 * 24 * 7
		reply.setCookie('sessionId', sessionId, {
			path: '/',
			httpOnly: true,
			maxAge: sevenDaysInSeconds,
		})
	}

	const useCase = makeCreateMultiTaskUseCase()
	const { tasks } = await useCase.execute({
		listOfTasks: parsedTasks,
		sessionId,
	})

	return reply.status(201).send({ data: tasks })
}
