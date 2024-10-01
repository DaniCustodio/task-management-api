import { z } from 'zod'

const CreateTasksSchema = z
	.object({
		id: z.string().uuid(),
		sessionId: z.string().uuid(),
		title: z.string().min(1),
		description: z.string().min(1),
	})
	.required()

type CreateTask = z.infer<typeof CreateTasksSchema>

export { CreateTasksSchema, type CreateTask }
