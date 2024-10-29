import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [tsConfigPaths()],
	test: {
		environment: './prisma/vitest-environment-prisma.ts',
		environmentMatchGlobs: [
			'src/http/controllers/**',
			'./prisma/vitest-environment-prisma.ts',
		],
	},
})
