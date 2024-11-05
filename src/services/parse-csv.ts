import fs from 'node:fs'
import { parse } from 'csv-parse'

interface NewTask {
	title: string
	description: string
}

export async function parseCsv(filePath: string): Promise<NewTask[]> {
	try {
		const tasks: NewTask[] = []

		const parser = parse({
			columns: true,
			skipEmptyLines: true,
			delimiter: ',',
		})

		const stream = fs.createReadStream(filePath).pipe(parser)

		for await (const data of stream) {
			const { title, description } = data
			tasks.push({ title, description })
		}

		if (tasks.length === 0) {
			throw new Error('Empty CSV file')
		}

		return tasks
	} catch (error) {
		console.log('❌ Error parsing CSV file:', error)
		throw new Error('Invalid CSV file')
	}
}
