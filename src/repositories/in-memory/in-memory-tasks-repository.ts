import { randomUUID } from 'node:crypto'
import type { NewTask, Task } from '@/types'
import type {
	DeleteTask,
	FindByDescription,
	FindById,
	FindByTitle,
	TaskRepository,
	UpdateTask,
} from '../tasks-repository'

export class InMemoryTasksRepository implements TaskRepository {
	private tasks: Task[] = []

	async create(task: NewTask): Promise<Task> {
		const newTask: Task = {
			...task,
			id: task.id || randomUUID(),
			created_at: new Date(),
			updated_at: new Date(),
			completed_at: null,
		}

		this.tasks.push(newTask)
		return Promise.resolve(newTask)
	}

	async findByTitle({ title, sessionId }: FindByTitle): Promise<Task[]> {
		const tasks = this.tasks.filter((task) => {
			return task.title === title && task.session_id === sessionId
		})

		return Promise.resolve(tasks)
	}

	async findByDescription({
		description,
		sessionId,
	}: FindByDescription): Promise<Task[]> {
		const tasks = this.tasks.filter((task) => {
			return task.description === description && task.session_id === sessionId
		})

		return Promise.resolve(tasks)
	}

	async findById({ id, sessionId }: FindById): Promise<Task | null> {
		const task = this.tasks.find((task) => {
			return task.id === id && task.session_id === sessionId
		})

		return task ? Promise.resolve(task) : Promise.resolve(null)
	}

	async findBySessionId(sessionId: string): Promise<Task[]> {
		const tasks = this.tasks.filter((task) => {
			return task.session_id === sessionId
		})

		return Promise.resolve(tasks)
	}

	async update(task: UpdateTask): Promise<Task> {
		const updatedTask = this.tasks.find((item) => {
			return item.id === task.id && item.session_id === task.session_id
		})

		if (!updatedTask) {
			throw new Error('Task not found')
		}

		const newTask: Task = {
			...updatedTask,
			title: task.title ?? updatedTask.title,
			description: task.description ?? updatedTask.description,
			updated_at: new Date(),
		}

		this.tasks = this.tasks.map((item) => {
			if (item.id === task.id && item.session_id === task.session_id) {
				return newTask
			}
			return item
		})

		return Promise.resolve(newTask)
	}

	async delete({ id, sessionId }: DeleteTask): Promise<Task | null> {
		const task = this.tasks.find((item) => {
			return item.id === id && item.session_id === sessionId
		})

		if (!task) {
			return null
		}

		return Promise.resolve(task)
	}
}
