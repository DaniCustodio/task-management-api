import type { NewTask, Task } from '@/types'

export interface FindByTitle {
	title: string
	sessionId: string
}

export interface FindByDescription {
	description: string
	sessionId: string
}

export interface FindById {
	id: string
	sessionId: string
}

export interface UpdateTask {
	id: string
	session_id: string
	title?: string
	description?: string
}

export interface TaskRepository {
	create(task: NewTask): Promise<Task>
	findByTitle({ title, sessionId }: FindByTitle): Promise<Task[]>
	findByDescription({
		description,
		sessionId,
	}: FindByDescription): Promise<Task[]>
	findById({ id, sessionId }: FindById): Promise<Task | undefined>
	findBySessionId(sessionId: string): Promise<Task[]>
	update(task: UpdateTask): Promise<Task>
}
