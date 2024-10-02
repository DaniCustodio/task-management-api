import { z } from 'zod'

const GetTasksParamsSchema = z.object({
	title: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
})

type GetTasksParams = z.infer<typeof GetTasksParamsSchema>

export { GetTasksParamsSchema, type GetTasksParams }
