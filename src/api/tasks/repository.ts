import { db } from '../../database/db'

interface InsertTask {
	id: string
	session_id: string
	title: string
	description: string
}

async function createTask(task: InsertTask) {
	return await db
		.insertInto('tasks')
		.values({
			id: task.id,
			session_id: task.session_id,
			title: task.title,
			description: task.description,
		})
		.returningAll()
		.executeTakeFirstOrThrow()
}

const taskRepository = {
	createTask,
}

export { taskRepository }
