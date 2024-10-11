import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [tsConfigPaths()],
	test: {
		environment: './src/database/vitest-environment-kysely.ts',
		environmentMatchGlobs: [
			[
				'src/http/controllers/**',
				'./src/database/vitest-environment-kysely.ts',
			],
		],
		dir: 'src',
	},
})
