import { z } from 'zod';

export const userSchema = z.object({
  DevId: z.number(),
  DeviceToken: z.string(),
  DeviceType: z.string(),
  Id: z.number(),
  RefreshToken: z.string(),
  TokenExpired: z.string(),
  login: z.string(),
  password: z.string(),
  role: z.string(),
  send_push: z.boolean(),
});

export const userListSchema = z.array(userSchema);

export type UserType = z.infer<typeof userSchema>;
