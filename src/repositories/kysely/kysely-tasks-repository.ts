import { db } from '@/database/db'
import type { NewTask, Task } from '@/types'
import type {
	FindByDescription,
	FindById,
	FindByTitle,
	TaskRepository,
	UpdateTask,
} from '../tasks-repository'

export class KyselyTasksRepository implements TaskRepository {
	async create(task: NewTask): Promise<Task> {
		const { id, session_id, title, description } = task

		return await db
			.insertInto('tasks')
			.values({
				id,
				session_id,
				title,
				description,
			})
			.returningAll()
			.executeTakeFirstOrThrow()
	}
	async findByTitle({ title, sessionId }: FindByTitle): Promise<Task[]> {
		return await db
			.selectFrom('tasks')
			.selectAll()
			.where('title', '=', title)
			.where('session_id', '=', sessionId)
			.execute()
	}
	async findByDescription({
		description,
		sessionId,
	}: FindByDescription): Promise<Task[]> {
		return await db
			.selectFrom('tasks')
			.selectAll()
			.where('description', '=', description)
			.where('session_id', '=', sessionId)
			.execute()
	}
	async findById({ id, sessionId }: FindById): Promise<Task | undefined> {
		return await db
			.selectFrom('tasks')
			.selectAll()
			.where('id', '=', id)
			.where('session_id', '=', sessionId)
			.executeTakeFirst()
	}
	async findBySessionId(sessionId: string): Promise<Task[]> {
		return await db
			.selectFrom('tasks')
			.selectAll()
			.where('session_id', '=', sessionId)
			.execute()
	}
	async update(task: UpdateTask): Promise<Task> {
		const { id, session_id, title, description } = task
		return await db
			.updateTable('tasks')
			.set({ title, description })
			.where('id', '=', id)
			.where('session_id', '=', session_id)
			.returningAll()
			.executeTakeFirstOrThrow()
	}
}
