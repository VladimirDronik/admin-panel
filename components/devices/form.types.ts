import {
  DevicePropertyKey, ObjectsCategory, DeviceInterface, Sensor, Controller,
} from '~/types/DevicesEnums';
import { type DeviceZoneId, type DevicePort } from '~/types/DevicesTypes';

export interface DevicePropertyData {
    value?: number;
    value_updated_at?: string;
    min_error_value?: number;
    min_threshold: number;
    max_threshold: number;
    max_error_value?: number;
    unit: string;
    write_graph?: boolean;
  }

export type DeviceChildrenRequired = Record<DevicePropertyKey, DevicePropertyData>

export type DeviceChildren = Partial<DeviceChildrenRequired>;

export type AddFieldToDynamicFormPayload = (key: DevicePropertyKey, value: DevicePropertyData) => void;

export interface DynamicFormDataBasic {
    sdaPort: DevicePort,
    sclPort: DevicePort,
    busAdress?: number | null;
    parent_id: number,
    name: string,
    zone_id: DeviceZoneId,
    category: ObjectsCategory,
    props: {
      interface?: DeviceInterface;
      update_interval: number,
      address?: string;
    },
  }

export interface DynamicFormData extends DynamicFormDataBasic {
    children: DeviceChildren,
  }

export interface CreateDeviceInitialForm {
    name: string;
    type: string;
    zone_id: DeviceZoneId;
    category: string;
    tags: string[];
  }

export interface DeviceProps {
    interface?: DeviceInterface;
    address: string;
    update_interval: number;
  }

export interface DeviceChild {
    Type: string;
    Props: DevicePropertyData;
    Children: null;
  }

export interface DeviceCreateFormObject extends CreateDeviceInitialForm {
    parent_id?: number;
    props: DeviceProps;
    Children: DeviceChild[];
    events: unknown[];
  }

export interface DeviceCreateFormPayload {
    object: DeviceCreateFormObject
  }

export type DeviceEditFormPayload = Omit<DeviceCreateFormObject, 'tags' | 'events'> & { id: number }

export type FormDataToTransform = CreateDeviceInitialForm & DynamicFormData

export type PropsFormDeviceData = Omit<DynamicFormDataBasic, 'category'>;

export type EditDeviceForm = DynamicFormData & { type: Sensor | Controller | '', id: number, status: string }
