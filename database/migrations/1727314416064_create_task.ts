import { type Kysely, sql } from 'kysely'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('tasks')
		.addColumn('id', 'uuid', (col) => col.primaryKey())
		.addColumn('title', 'text', (col) => col.notNull())
		.addColumn('description', 'text', (col) => col.notNull())
		.addColumn('session_id', 'uuid', (col) => col.notNull())
		.addColumn('completed_at', 'text')
		.addColumn('created_at', 'text', (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
		)
		.addColumn('updated_at', 'text', (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
		)
		.execute()

	await db.schema
		.createIndex('tasks_session_id_index')
		.on('tasks')
		.column('session_id')
		.execute()
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropIndex('tasks_session_id_index').execute()
	await db.schema.dropTable('tasks').execute()
}
