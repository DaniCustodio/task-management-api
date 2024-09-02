import { type Knex, knex } from 'knex'
import { env } from '../env'

export const config: Knex.Config = {
	client: env.DB_CLIENT,
	connection:
		env.DB_CLIENT === 'sqlite3' ? { filename: env.DB_URL } : env.DB_URL,
	useNullAsDefault: true,
	migrations: {
		extension: 'ts',
		directory: './database/migrations',
	},
}

export const db = knex(config)
