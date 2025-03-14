// Types modules
import type { DeviceZoneId } from '~/types/DevicesTypes';
import type { FormTypes } from '~/components/device/form/form.types';

export interface GetCurrentDeviceResponse {
  parent_id: number;
  enabled: boolean;
  children: Child[];
  category: string;
  zone_id: DeviceZoneId;
  name: string;
  type: FormTypes;
  id: number;
  tags: string[];
  props: Property[];
  methods: unknown;
  events: unknown;
  status: string;
  internal: unknown;
}

export interface Child {
  type: string;
  props: Property[];
}

export interface Property {
  code: string;
  value: string | number | boolean;
}
