import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest/environments'
import { createDbClient } from './db'

const db = createDbClient()

function generateDatabaseURL(schema: string) {
	if (!process.env.DB_URL) {
		throw new Error('Please provide a DB_URL environment variable.')
	}

	const url = new URL(process.env.DB_URL)

	url.searchParams.set('schema', schema)

	return url.toString()
}

export default (<Environment>{
	name: 'kysely',
	transformMode: 'ssr',
	async setup() {
		const schema = randomUUID()
		const databaseURL = generateDatabaseURL(schema)

		process.env.DB_URL = databaseURL

		console.log('🤡 SETUP', databaseURL)

		execSync('npm run migrate:latest')

		return {
			async teardown() {
				console.log('🤡 TEARDOWN')
				// await db.schema.dropSchema(schema).ifExists().cascade().execute()
				await db.destroy()
			},
		}
	},
})
