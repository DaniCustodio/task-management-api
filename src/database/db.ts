import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import type { Database } from '../types'

const dialect = new SqliteDialect({
	database: new SQLite('./database/tasks.db'),
})

export const db = new Kysely<Database>({
	dialect,
})
