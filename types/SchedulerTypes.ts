import z from 'zod';

export const SchedulerSchema = z.object({
  id: z.number(),
  enabled: z.boolean(),
  name: z.string(),
  period: z.string(),
  description: z.string(),
});

export const requestSchedulerSchema = z.object({
  list: z.array(SchedulerSchema),
  total: z.number(),
});

export type RequestSchedulerTypes = z.infer<typeof requestSchedulerSchema>;

export type SchedulerTypes = z.infer<typeof SchedulerSchema>;
