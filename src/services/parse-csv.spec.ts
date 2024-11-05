import { describe, expect, it } from 'vitest'
import { parseCsv } from './parse-csv'

describe('Parse CSV', () => {
	it('should return an array of tasks', async () => {
		const tasks = await parseCsv('./src/utils/test/tasks-example.csv')

		expect(tasks.length).toEqual(5)
	})

	it('should throw an error if the file is empty', async () => {
		expect(
			parseCsv('./src/utils/test/empty-tasks-example.csv')
		).rejects.toThrow('Invalid CSV file')
	})

	it('should throw an error if the file has an invalid format', async () => {
		expect(
			parseCsv('./src/utils/test/invalid-tasks-example.csv')
		).rejects.toThrow('Invalid CSV file')
	})
})
