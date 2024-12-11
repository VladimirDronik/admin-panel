import { z } from 'zod';

export const scriptSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  body: z.string(),
  description: z.string(),
});

export const scriptRequestSchema = z.object({
  list: z.array(scriptSchema),
  total: z.number(),
});

export type ScriptType = z.infer<typeof scriptSchema>;

export type ScriptData = z.infer<typeof scriptRequestSchema>;
