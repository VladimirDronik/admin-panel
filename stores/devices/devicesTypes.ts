import { z } from 'zod';

// Devices

export const deviceProps = z.object({
  value: z.string(),
});

export const deviceEvents = z.object({
  code: z.string(),
  description: z.string(),
  name: z.string(),
  target_type: z.string(),
});

export const deviceSchema = z.object({
  category: z.string(),
  id: z.number(),
  internal: z.boolean(),
  name: z.string(),
  status: z.string(),
  type: z.string(),
  tags: z.array(z.string()),
  zone_id: z.string().optional(),
  events: z.record(deviceEvents),
  props: z.array(deviceProps).optional(),
  isChild: z.boolean().optional(),
});

type Device = z.infer<typeof deviceSchema> & {
  children?: Device[];
};

export const fullDeviceSchema: z.ZodType<Device> = deviceSchema.extend({
  children: z.lazy(() => fullDeviceSchema.array()).optional(),
});

export type FullDevice = z.infer<typeof fullDeviceSchema>;

export const devicesListSchema = z.array(fullRoomSchema);
//

// Types
export const typeSchema = z.object({
  name: z.string(),
  type: z.string(),
  category: z.string(),
});

export const typesListSchema = z.array(typeSchema);

export type TypeData = z.infer<typeof typeSchema>;
//

// Tags
export const tagsSchema = z.record(z.number());

export type TagsData = z.infer<typeof tagsSchema>;
//

// Ports
export const portSchema = z.object({
  mode: z.string(),
  number: z.number(),
  type: z.string(),
  objects: z.array(z.string()).optional(),
});

export const tablePortSchema = z.object({
  group: z.string(),
  ports: z.array(portSchema),
});

export const TablePortListSchema = z.array(tablePortSchema);

export type TablePortData = z.infer<typeof tablePortSchema>;
//
