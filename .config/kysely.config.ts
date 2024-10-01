import { defineConfig } from 'kysely-ctl'
import { db as kysely } from '../src/database/db'

export default defineConfig({
	kysely,
	migrations: {
		migrationFolder: './database/migrations',
	},
	//   plugins: [],
	seeds: {
		seedFolder: './database/seeds',
	},
})
