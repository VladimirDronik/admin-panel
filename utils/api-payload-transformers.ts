import type {
  DeviceCreateFormPayload, FormDataToTransform, EditDeviceForm, DeviceEditFormPayload, DeviceChildren,
  DevicePropertyData,
} from '~/components/device/form/form.types';
import { getInitialEditDeviceFormDataByTypes } from '~/components/forms/byTypes/initial-dynamic-form-data';
import type { GetCurrentDeviceResponse } from '~/components/rightBar/right-bar.types';
import type { DevicePropertyKey, Connection } from '~/types/DevicesEnums';
import {
  ObjectsCategory,
  Sensor, Controller, Relay, GenericInput,
  DeviceInterface,
  Regulator,
  RS485,
  Server,
  Counter,
} from '~/types/DevicesEnums';

const createAddress = (formData: FormDataToTransform | EditDeviceForm): string => {
  const isConditioner = formData.category === ObjectsCategory.Conditioner;
  const isDS1820 = formData.type === Sensor.DS18B20;
  const isMegaD = formData.type === Controller.MegaD;
  const isSinglePortDevice = formData.type === Relay.Relay || formData.type === GenericInput.GenericInput || formData.type === Sensor.MOTION || formData.type === Sensor.CS || formData.type === Counter.ImpulseCounter;
  const isRegulator = formData.type === Regulator.Regulator;
  let address = `${formData.sdaPort};${formData.sclPort}`;
  if (isDS1820 && formData.props.interface === '1W') address = String(formData.sdaPort);
  if (isDS1820 && formData.props.interface === '1WBUS') address = `${formData.sdaPort};${formData.busAddress}`;
  if (isMegaD) address = String(formData.props.address);
  if (isSinglePortDevice) address = `${formData.sdaPort}`;
  if (isRegulator) address = '';
  if (isConditioner) address = Number(formData.props.address) as unknown as string;
  return address;
};

const formatChildren = (children: DeviceChildren | undefined) => {
  if (!children) return [];
  return Object.entries(children).map(([key, value]) => ({
    type: key,
    props: value,
    children: null,
  }));
};

const createConnectionString = (formData: FormDataToTransform | EditDeviceForm): string => {
  if (!formData.props.ip) return '';
  if (!formData.props.port) return formData.props.ip;
  return `tcp://${formData.props.ip}:${formData.props.port}`;
};

const createNumericValueWithUnit = (formData: FormDataToTransform | EditDeviceForm): string => `${formData.props.numericValue ?? 0}${formData.props.selectedUnit ?? 's'}`;

export const transformToDeviceCreateFormPayload = (
  formData: FormDataToTransform,
): DeviceCreateFormPayload => {
  const children = formatChildren(formData.children);

  const result = { object: { ...formData, children } };
  if (formData.type !== RS485.Bus && formData.type !== Regulator.Regulator) {
    result.object.props.address = createAddress(formData);
  }
  if (formData.type === RS485.Bus) {
    result.object.props.connection_string = createConnectionString(formData);
    result.object.props.timeout = createNumericValueWithUnit(formData);
  }

  if (formData.type === Sensor.MOTION || formData.type === Sensor.PRESENCE) {
    result.object.props.period = createNumericValueWithUnit(formData);
  }

  if (
    (formData.category === 'sensor'
      && formData.type !== Sensor.MOTION
      && formData.type !== Sensor.PRESENCE)
    || formData.type === Counter.ImpulseCounter
    || formData.type === Regulator.Regulator
  ) {
    result.object.props.update_interval = createNumericValueWithUnit(formData);
  }

  if (!formData.children && 'children' in result.object) {
    // @ts-expect-error ///
    delete result.object['children'];
  }
  delete result.object.sdaPort;
  delete result.object.sclPort;
  delete result.object.busAddress;
  delete result.object.props.ip;
  delete result.object.props.port;
  delete result.object.props.numericValue;
  delete result.object.props.selectedUnit;

  return result;
};

export const transformToDeviceEditFormPayload = (
  formData: EditDeviceForm,
): DeviceEditFormPayload => {
  const children = formatChildren(formData.children);
  const result = { ...formData, children, events: [] };
  if (formData.type !== Regulator.Regulator && formData.type !== RS485.Bus && formData.type !== Server.Server) {
    result.props.address = createAddress(formData);
  }
  if (formData.type === RS485.Bus) {
    result.props.connection_string = createConnectionString(formData);
    result.props.timeout = createNumericValueWithUnit(formData);
  }
  if (formData.type === Sensor.MOTION || formData.type === Sensor.PRESENCE) {
    result.props.period = createNumericValueWithUnit(formData);
  }
  if (
    (formData.category === 'sensor'
      && formData.type !== Sensor.MOTION
      && formData.type !== Sensor.PRESENCE)
    || formData.type === Counter.ImpulseCounter
    || formData.type === Regulator.Regulator
  ) {
    result.props.update_interval = createNumericValueWithUnit(formData);
  }

  const resultWithoutPorts = Object.fromEntries(
    Object.entries(result).filter(([key]) => key !== 'sdaPort' && key !== 'sclPort' && key !== 'busAddress'),
  );

  const resultPropsWithoutPorts = Object.fromEntries(
    Object.entries(result.props).filter(([key]) => key !== 'ip' && key !== 'port' && key !== 'numericValue' && key !== 'selectedUnit'),
  );

  let finalResult = {
    ...resultWithoutPorts,
    props: resultPropsWithoutPorts,
  };

  if (!formData.children && 'children' in result) {
    finalResult = {
      ...Object.fromEntries(Object.entries(finalResult).filter(([key]) => key !== 'children')),
      props: resultPropsWithoutPorts,
    };
  }

  return finalResult as DeviceEditFormPayload;
};

export const transformResponseToFormData = (data: GetCurrentDeviceResponse): EditDeviceForm | null => {
  if (!data.id) return null;

  type UpdateItem<T = Record<string, unknown>> = {
    key: keyof T;
    value: T[keyof T];
    cast: (v: unknown) => T[keyof T];
    target: 'props' | 'root';
    condition?: () => boolean;
  };

  const address = data.props.find((prop) => prop.code === 'address');
  const updatedInterface = (data.props.find((prop) => prop.code === 'interface')?.value ?? DeviceInterface['1W']) as DeviceInterface;
  const updatedbusAddress = typeof address?.value === 'string' && address.value.includes(';') ? String(address.value).split(';')[1] ?? null : null;
  const ports = String(address?.value).split(';') ?? [null, null];
  const updatedConnectionString = data.props.find((prop) => prop.code === 'connection_string');
  const connectionStringValue = updatedConnectionString?.value ? String(updatedConnectionString.value) : '';
  const parsedConnection = connectionStringValue.match(/^tcp:\/\/([\d.]+):(\d+)$/);
  const [ip, port] = parsedConnection?.slice(1) ?? [null, null];
  const rawConnectionString = parsedConnection ? null : connectionStringValue;

  const parseNumericValueWithUnit = (value: unknown): { numericValue: number; selectedUnit: string } => {
    const stringValue = String(value ?? '').trim();
    const match = stringValue.match(/^(\d+)(ms|s|m|h)$/i);

    return {
      numericValue: match ? Number(match[1]) : 0,
      selectedUnit: match ? match[2] : 's',
    };
  };

  const timeout = data.props.find((prop) => prop.code === 'timeout')?.value;
  const period = data.props.find((prop) => prop.code === 'period')?.value;
  const updateInterval = data.props.find((prop) => prop.code === 'update_interval')?.value;

  let numericValue = 0;
  let selectedUnit = 's';

  if (period !== undefined) {
    ({ numericValue, selectedUnit } = parseNumericValueWithUnit(period));
  } else if (timeout !== undefined) {
    ({ numericValue, selectedUnit } = parseNumericValueWithUnit(timeout));
  } else if (updateInterval !== undefined) {
    ({ numericValue, selectedUnit } = parseNumericValueWithUnit(updateInterval));
  }

  const children = data.children?.reduce((childrenAcc, child) => {
    const key = child.type as DevicePropertyKey;

    const propertyData = child.props.reduce((acc, prop) => {
      const key = prop.code as keyof DevicePropertyData;
      const value = prop.value as DevicePropertyData[keyof DevicePropertyData];
      // @ts-expect-error
      acc[key] = value;
      return acc;
    }, {} as DevicePropertyData);

    return {
      ...childrenAcc,
      [key]: propertyData,
    };
  }, {} as DeviceChildren) ?? {};

  const initialForm = getInitialEditDeviceFormDataByTypes(data);

  const updates: UpdateItem[] = [
    {
      key: 'address', value: address?.value, cast: String, target: 'props',
    },
    {
      key: 'protocol', value: data.props.find((p) => p.code === 'protocol')?.value, cast: String, target: 'props',
    },
    {
      key: 'password', value: data.props.find((p) => p.code === 'password')?.value, cast: String, target: 'props',
    },
    {
      key: 'id', value: data.props.find((p) => p.code === 'id')?.value, cast: String, target: 'props',
    },
    {
      key: 'id', value: data.id, cast: String, target: 'root',
    },
    {
      key: 'sdaPort', value: ports[0], cast: Number, target: 'root',
    },
    {
      key: 'sclPort', value: ports[1], cast: Number, target: 'root',
    },
    {
      key: 'busAddress', value: updatedbusAddress, cast: Number, target: 'root',
    },
    {
      key: 'interface', value: updatedInterface, cast: String, target: 'props',
    },
    {
      key: 'status', value: data.status, cast: String, target: 'root',
    },
    {
      key: 'mode', value: data.props.find((p) => p.code === 'mode')?.value, cast: String, target: 'props',
    },
    {
      key: 'ip', value: ip ?? rawConnectionString, cast: String, target: 'props',
    },
    {
      key: 'port',
      value: port ? Number(port) : null,
      cast: (v) => v as number | null,
      target: 'props',
    },
    {
      key: 'numericValue', value: numericValue, cast: Number, target: 'props',
    },
    {
      key: 'selectedUnit', value: selectedUnit, cast: String, target: 'props',
    },
    {
      key: 'enabled', value: data.enabled, cast: Boolean, target: 'root',
    },
    {
      key: 'children',
      value: children,
      cast: (v) => v as DeviceChildren,
      target: 'root',
    },
  ];

  const codes = [
    'speed', 'data_bits', 'parity', 'stop_bits', 'tries', 'server_id', 'eco_mode', 'guard_mode', 'night_mode',
    'heating_mode', 'light_mode', 'logging', 'storage_logs', 'graph_date', 'time_zone', 'total', 'unit',
    'multiplier', 'type_param', 'last_update', 'price', 'fast_config', 'min_sp', 'target_sp', 'max_sp',
    'below_tolerance', 'above_tolerance', 'complex_tolerance', 'fallback_sensor_value_id', 'internal_temperature',
    'external_temperature', 'power_status', 'operating_mode', 'target_temperature', 'fan_speed',
    'horizontal_slats_mode', 'vertical_slats_mode', 'display_backlight', 'silent_mode', 'turbo_mode', 'sleep_mode',
    'ionization', 'self_cleaning', 'anti_fungus', 'disable_display_on_power_off', 'sounds', 'on_duty_heating',
    'soft_flow', 'display_high_brightness',
  ];

  codes.forEach((code) => {
    const prop = data.props.find((p) => p.code === code);
    if (prop && initialForm.props && code in initialForm.props) {
      // @ts-expect-error
      initialForm.props[code] = prop.value;
    }
  });

  updates.forEach(({
    key, value, cast, target, condition,
  }) => {
    const targetObj = target === 'props' ? initialForm.props : initialForm;

    if (
      targetObj
      && Object.prototype.hasOwnProperty.call(targetObj, key)
      && value !== undefined
      && value !== null
      && (typeof condition === 'undefined' || condition())
    ) {
      (targetObj as Record<string, unknown>)[key] = cast(value);
    }
  });

  return initialForm;
};
