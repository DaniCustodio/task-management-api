import { randomUUID } from 'node:crypto'
import { prisma } from '@/lib/prisma'

export async function createTask() {
	const task = await prisma.task.create({
		data: {
			title: 'Test Task',
			description: 'Test Task Description',
			session_id: randomUUID(),
		},
	})

	const { session_id, id } = task
	return { cookies: [`sessionId=${session_id}`], taskId: id }
}