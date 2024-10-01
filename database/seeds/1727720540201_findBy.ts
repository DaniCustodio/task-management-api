import type { Kysely } from 'kysely'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function seed(db: Kysely<any>): Promise<void> {
	await db
		.insertInto('tasks')
		.values([
			{
				title: 'Buy milk',
				description: 'Milk is the best drink',
				session_id: '83fb772e-d1cd-4c4d-8f0f-5507ee1db06c',
				id: '83fb772e-d1cd-4c4d-8f0f-3b07ee1db06c',
			},
			{
				title: 'Buy eggs',
				description: 'Eggs are the best food',
				session_id: '83fb772e-d1cd-4c4d-8f0f-5507ee1db06c',
				id: '83fb772e-d1cd-4c4d-8f0f-9807ee1db06c',
			},
			{
				title: 'Buy bread',
				description: 'Bread is the best food',
				session_id: '76364e2e-d1cd-4c4d-8f0f-3407ee1db06c',
				id: '435fb772e-d1cd-4c4d-8f0f-4507ee1db06c',
			},
			{
				title: 'Buy cheese',
				description: 'Cheese is the best food',
				session_id: '76364e2e-d1cd-v7c4d-8f0f-3407ee1db06c',
				id: '435fb772e-d1cd-34c4d-8f0f-4507ee1db06c',
			},
		])
		.execute()
}
