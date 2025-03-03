import { number, z } from 'zod';

export const roomBtns = z.object({
  description: z.string(),
  group_elements: z.array(z.object({})).optional(),
  icon: z.string(),
  item_id: z.number(),
  params: z.object({
    is_setted_as_group: z.boolean().optional(),
  }).optional(),
  position_left: z.number(),
  position_top: z.number(),
  scene: z.number(),
  sort: z.number(),
  status: z.string(),
  title: z.string(),
  type: z.string(),
  color: z.string().optional(),
});

export const roomSensors = z.object({
  icon: z.string().optional(),
  item_id: z.number(),
  type: z.string(),
  zone_id: z.number(),
  current: number(),
});

export const roomsItem = z.object({
  id: z.number(),
  parent_id: z.number(),
  sort: z.number(),
  name: z.string(),
  style: z.string(),
  items: z.array(roomBtns).optional(),
  sensors: z.array(roomSensors).optional(),
});
export const scenarioItem = z.object({
  item_id: z.number(),
  sort: z.number(),
  enabled: z.boolean(),
  title: z.string(),
  color: z.string(),
  description: z.string(),
  icon: z.string(),
  type: z.string(),
  status: z.string(),
});

export const displayRequestSchema = z.object({
  room_items: z.array(roomsItem).optional(),
  scenario_items: z.array(scenarioItem),
});

export type roomSensorTypes = z.infer<typeof roomSensors>;

export type RoomBtnsData = z.infer<typeof roomBtns>;

export type DisplayData = z.infer<typeof displayRequestSchema>;

// Get Item
export const itemSchema = z.object({
  description: z.string(),
  enabled: z.boolean(),
  icon: z.string(),
  item_id: z.number(),
  position_left: z.number(),
  position_top: z.number(),
  scene: z.number(),
  sort: z.number(),
  status: z.string(),
  title: z.string(),
  type: z.string(),
  zone_id: z.number(),
  control_object: z.number().optional(),
  color: z.string().optional(),
});

export type itemType = z.infer<typeof itemSchema>;
//
