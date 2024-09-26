import type {
	ColumnType,
	Generated,
	Insertable,
	Selectable,
	Updateable,
} from 'kysely'

export interface Database {
	tasks: TaskTable
}

export interface TaskTable {
	id: string
	title: string
	description: string
	session_id: string
	completed_at: string | null
	created_at: ColumnType<Date, string | undefined, never>
	updated_at: ColumnType<Date, string | undefined>
}

export type Task = Selectable<TaskTable>
export type NewTask = Insertable<TaskTable>
export type TaskUpdate = Updateable<TaskTable>
