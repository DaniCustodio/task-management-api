import { z } from 'zod'

const UpdateTasksSchema = z.object({
	title: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
})

type UpdateTask = z.infer<typeof UpdateTasksSchema>

const UpdateTasksParamsSchema = z
	.object({
		id: z.string().uuid(),
	})
	.required()

type UpdateTasksParams = z.infer<typeof UpdateTasksParamsSchema>

export {
	UpdateTasksSchema,
	type UpdateTask,
	UpdateTasksParamsSchema,
	type UpdateTasksParams,
}
