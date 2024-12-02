import { z } from 'zod';

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
});

export const roomSensors = z.object({
  current: z.number(),
  enabled: z.boolean(),
  icon: z.string(),
  id: z.number(),
  id_item: z.number(),
  name: z.string(),
  position_left: z.number(),
  position_top: z.number(),
  sort: z.number(),
  type: z.string(),
  zone_id: z.number(),
});

export const roomsItem = z.object({
  id: z.number(),
  parent_id: z.number(),
  sort: z.number(),
  name: z.string(),
  style: z.string(),
  items: z.array(roomBtns),
  sensors: z.array(roomSensors).optional(),
});
export const scenarioItem = z.object({
  id: z.number(),
  sort: z.number(),
  id_item: z.number(),
  enabled: z.boolean(),
  title: z.string(),
  color: z.string(),
  description: z.string(),
  icon: z.string(),
  type: z.string(),
  status: z.string(),
});

export const displayRequestSchema = z.object({
  room_items: z.array(roomsItem),
  scenario_items: z.array(scenarioItem),
});

export type RoomBtnsData = z.infer<typeof roomBtns>;

export type DisplayData = z.infer<typeof displayRequestSchema>;
