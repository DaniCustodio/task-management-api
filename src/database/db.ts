import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import { env } from '../env'
import type { Database } from '../types.ts'

const dbPath =
	env.NODE_ENV === 'test' ? './database/test.db' : './database/tasks.db'

const dialect = new SqliteDialect({
	database: new SQLite(dbPath),
})

export const db = new Kysely<Database>({
	dialect,
})
