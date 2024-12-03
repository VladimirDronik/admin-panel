import { type Component } from 'vue';
import { deviceFormMapping } from './mappings';

export function getDeviceFormComponent(type: string): Component | null {
  const mapping = deviceFormMapping.find((item) => item.type === type);
  return mapping?.component || null;
}
