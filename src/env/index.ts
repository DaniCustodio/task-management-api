import { config } from 'dotenv'
import { z } from 'zod'

// Load the environment variables based on the NODE_ENV
if (process.env.NODE_ENV === 'test') {
	config({ path: '.env.test' })
} else {
	config()
}

// Validate the environment variables
const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
	PORT: z.coerce.number().default(3333),
	DB_CLIENT: z.enum(['pg', 'sqlite3']).default('sqlite3'),
	DB_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)
if (!_env.success) {
	console.error('Invalid environment variables:', _env.error.format())
	throw new Error('Invalid environment variables')
}

export const env = _env.data
