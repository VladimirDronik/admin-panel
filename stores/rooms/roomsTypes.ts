import { z } from 'zod';

export interface SelectRoom {
  name: string;
  code: number;
  inGroup?: {
    color: string,
    name: string,
    code: number,
  }
}

export interface RequestData {
  data: {
    response: Room[]
  }
}

const roomSchema = z.object({
  id: z.number(),
  name: z.string(),
  style: z.string(),
  sort: z.number(),
  is_group: z.boolean(),
});

type Room = z.infer<typeof roomSchema> & {
  rooms_in_group?: Room[];
};

export const fullRoomSchema: z.ZodType<Room> = roomSchema.extend({
  rooms_in_group: z.lazy(() => fullRoomSchema.array()).optional(),
});

export const roomRequestSchema = z.array(fullRoomSchema);

export type RoomItem = z.infer<typeof fullRoomSchema>;

export type RoomList = z.infer<typeof roomRequestSchema>;
