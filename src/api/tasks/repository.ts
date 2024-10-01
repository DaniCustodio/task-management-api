import type { Kysely } from 'kysely'
import type { Database, Task } from '../../types'
import type { CreateTask } from './create-tasks'

interface UpdateTask {
	id: string
	session_id: string
	updateFields: {
		title?: string
		description?: string
	}
}

export interface TaskRepo {
	createTask(task: CreateTask): Promise<Task>
	findByTitle(title: string, sessionId: string): Promise<Task[]>
	findByDescription(description: string, sessionId: string): Promise<Task[]>
	findBySessionId(sessionId: string): Promise<Task[]>
	findTask(id: string, sessionId: string): Promise<Task | undefined>
	updateTask(task: UpdateTask): Promise<Task>
}
export class TaskRepository implements TaskRepo {
	private db: Kysely<Database>

	constructor(db: Kysely<Database>) {
		this.db = db
	}

	async createTask(task: CreateTask): Promise<Task> {
		return await this.db
			.insertInto('tasks')
			.values({
				id: task.id,
				session_id: task.sessionId,
				title: task.title,
				description: task.description,
			})
			.returningAll()
			.executeTakeFirstOrThrow()
	}
	async findByTitle(title: string, sessionId: string): Promise<Task[]> {
		return await this.db
			.selectFrom('tasks')
			.selectAll()
			.where('title', '=', title)
			.where('session_id', '=', sessionId)
			.execute()
	}
	async findByDescription(
		description: string,
		sessionId: string
	): Promise<Task[]> {
		return await this.db
			.selectFrom('tasks')
			.selectAll()
			.where('description', '=', description)
			.where('session_id', '=', sessionId)
			.execute()
	}
	async findBySessionId(sessionId: string): Promise<Task[]> {
		return await this.db
			.selectFrom('tasks')
			.selectAll()
			.where('session_id', '=', sessionId)
			.execute()
	}
	async findTask(id: string, sessionId: string): Promise<Task | undefined> {
		return await this.db
			.selectFrom('tasks')
			.selectAll()
			.where('id', '=', id)
			.where('session_id', '=', sessionId)
			.executeTakeFirst()
	}
	async updateTask(task: UpdateTask): Promise<Task> {
		const { id, session_id, updateFields } = task
		return await this.db
			.updateTable('tasks')
			.set(updateFields)
			.where('id', '=', id)
			.where('session_id', '=', session_id)
			.returningAll()
			.executeTakeFirstOrThrow()
	}
}
