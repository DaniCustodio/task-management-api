import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'
const { Pool } = pg
import { env } from '../env'
import type { Database } from '../types.ts'

export function createDbClient() {
	console.log('🤡 CREATE DB CLIENT', env.DB_URL)

	const dialect = new PostgresDialect({
		pool: new Pool({
			connectionString: env.DB_URL,
		}),
	})

	const db = new Kysely<Database>({
		dialect,
		log: ['query', 'error'],
	})

	return db
}

export const db = createDbClient()
