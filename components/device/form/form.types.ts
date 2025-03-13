import {
  DevicePropertyKey, ObjectsCategory, DeviceInterface, Sensor, Controller, Connection, GenericInput, Relay,
  Regulator, RegulatorType,
  Conditioner, RS485, Server, Counter,
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
    enabled?: boolean,
    sensor_id?: number,
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
    update_interval?: string;
    id?: string;
    password?: string;
    protocol?: Connection;
    sensor_value_ttl?: string;
    type?: RegulatorType;
    min_sp?: number;
    target_sp?: number;
    max_sp?: number;
    below_tolerance?: number;
    above_tolerance?: number;
    complex_tolerance?: number;
    fallback_sensor_value_id?: number;
    period?: string;
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
    internal_temperature?: number;
    external_temperature?: number;
    target_temperature?: number;
    anti_fungus?: boolean;
    disable_display_on_power_off?: boolean;
    on_duty_heating?: boolean;
    soft_flow?: boolean;
    display_high_brightness ?: boolean;
    connection_string?: string;
    speed?: string;
    data_bits?: number;
    parity?: string;
    stop_bits?: string;
    timeout?: string;
    tries?: number;
    port?: number;
    ip?: string;
    numericValue?: number;
    selectedUnit?: string;
    server_id?: string;
    guard_mode?: boolean;
    night_mode?: boolean;
    heating_mode?: string;
    light_mode?: string;
    logging?: string;
    storage_logs?: number;
    graph_date?: number;
    time_zone?: string;
    total?: number;
    unit?: string;
    multiplier?: number;
    start_value?: number;
    type_param?: string;
    price?: number;
    last_update?: string;
    write_graph?: boolean;
    fast_config?: boolean;
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

export type FormTypes = Controller | Sensor | GenericInput | Relay | Regulator | Conditioner | RS485 | Server | Counter;
