import {
  DevicePropertyKey, ObjectsCategory, DeviceInterface, Sensor, Controller, Connection, GenericInput, Relay,
  Regulator, RegulatorType,
  Conditioner,
} from '~/types/DevicesEnums';
import { type DeviceZoneId, type DevicePort } from '~/types/DevicesTypes';

export interface DevicePropertyData {
    value?: number;
    value_updated_at?: string;
    min_error_value?: number;
    min_threshold?: number;
    max_threshold?: number;
    max_error_value?: number;
    unit?: string;
    write_graph?: boolean;
  }

export type DeviceChildrenRequired = Record<DevicePropertyKey, DevicePropertyData>

export type DeviceChildren = Partial<DeviceChildrenRequired>;

export type AddFieldToDynamicFormPayload = (key: DevicePropertyKey, value: DevicePropertyData) => void;

export interface DynamicFormDataBasic {
    sdaPort?: DevicePort,
    sclPort?: DevicePort,
    busAddress?: number | null;
    parent_id: number,
    name: string,
    zone_id: DeviceZoneId,
    category: ObjectsCategory,
    props: DeviceProps,
  }

export interface DynamicFormData extends DynamicFormDataBasic {
    children?: DeviceChildren,
  }

export interface CreateDeviceInitialForm {
    name: string;
    type: FormTypes;
    zone_id: DeviceZoneId;
    category: string;
    tags: string[];
  }

export interface DeviceProps {
    interface?: DeviceInterface;
    address?: string | number;
    update_interval?: string | number;
    id?: string;
    password?: string;
    protocol?: Connection;
    sensor_value_ttl?: number;
    type?: RegulatorType;
    min_sp?: number;
    target_sp?: number;
    max_sp?: number;
    below_tolerance?: number;
    above_tolerance?: number;
    complex_tolerance?: number;
    enable?: boolean;
    fallback_sensor_value_id?: number;
    period?: number;
    mode?: string;
    power_status?: boolean;
    display_backlight?: boolean;
    silent_mode?: boolean;
    eco_mode?: boolean;
    turbo_mode?: boolean;
    sleep_mode?: boolean;
    ionization?: boolean;
    self_cleaning?: boolean;
    sounds?: boolean;
    operating_mode?: string;
    fan_speed?: string;
    horizontal_slats_mode?: string;
    vertical_slats_mode?: string;
  }

export interface DeviceChild {
    type: string;
    props: DevicePropertyData;
    children: null;
  }

export interface DeviceCreateFormObject extends CreateDeviceInitialForm {
    parent_id?: number;
    props: DeviceProps;
    children?: DeviceChild[];
  }

export interface DeviceCreateFormPayload {
    object: DeviceCreateFormObject
  }

export type DeviceEditFormPayload = Omit<DeviceCreateFormObject, 'tags' | 'events'> & { id: number }

export type FormDataToTransform = CreateDeviceInitialForm & DynamicFormData

export type PropsFormDeviceData = Omit<DynamicFormDataBasic, 'category'>;

export type EditDeviceForm = DynamicFormData & { type: FormTypes, id: number, status: string }

export type FormTypes = Controller | Sensor | GenericInput | Relay | Regulator | Conditioner;
