import { z } from 'zod';

export interface LocalData {
  token: string | null;
  openSidebar: boolean;
  language: string;
}

export const loginSchema = z.object({
  api_access_token: z.string(),
  api_refresh_token: z.string(),
});

export type loginData = z.infer<typeof loginSchema>;
