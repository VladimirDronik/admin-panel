import type { DeviceZoneId } from '~/types/DevicesTypes';
import type { FormTypes } from '../devices/form.types';

export interface GetCurrentDeviceResponse {
    parent_id: number;
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
