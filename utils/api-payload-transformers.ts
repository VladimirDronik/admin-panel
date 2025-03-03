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
} from '~/types/DevicesEnums';

const createAddress = (formData: FormDataToTransform | EditDeviceForm): string => {
  const isConditioner = formData.category === ObjectsCategory.Conditioner;
  const isDS1820 = formData.type === Sensor.DS18B20;
  const isMegaD = formData.type === Controller.MegaD;
  const isRelayOrGenericInputOrMotionOrCS = formData.type === Relay.Relay || formData.type === GenericInput.GenericInput || formData.type === Sensor.MOTION || formData.type === Sensor.CS;
  const isRegulator = formData.type === Regulator.Regulator;
  let address = `${formData.sdaPort};${formData.sclPort}`;
  if (isDS1820 && formData.props.interface === '1W') address = String(formData.sdaPort);
  if (isDS1820 && formData.props.interface === '1WBUS') address = `${formData.sdaPort};${formData.busAddress}`;
  if (isMegaD) address = String(formData.props.address);
  if (isRelayOrGenericInputOrMotionOrCS) address = `${formData.sdaPort}`;
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

  if (formData.type === Regulator.Regulator) {
    result.object.props.sensor_value_ttl = createNumericValueWithUnit(formData);
  }

  if (formData.type === Sensor.MOTION || formData.type === Sensor.PRESENCE) {
    result.object.props.period = createNumericValueWithUnit(formData);
  }

  if (
    formData.category === 'sensor'
    && formData.type !== Sensor.MOTION
    && formData.type !== Sensor.PRESENCE
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
  if (formData.type !== Regulator.Regulator && formData.type !== RS485.Bus) {
    result.props.address = createAddress(formData);
  }
  if (formData.type === RS485.Bus) {
    result.props.connection_string = createConnectionString(formData);
    result.props.timeout = createNumericValueWithUnit(formData);
  }
  if (formData.type === Regulator.Regulator) {
    result.props.sensor_value_ttl = createNumericValueWithUnit(formData);
  }
  if (formData.type === Sensor.MOTION || formData.type === Sensor.PRESENCE) {
    result.props.period = createNumericValueWithUnit(formData);
  }
  if (
    formData.category === 'sensor'
    && formData.type !== Sensor.MOTION
    && formData.type !== Sensor.PRESENCE
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
  const address = data.props.find((prop) => prop.code === 'address');
  const updatedInterface = (data.props.find((prop) => prop.code === 'interface')?.value ?? DeviceInterface['1W']) as DeviceInterface;
  const updatedbusAddress = typeof address?.value === 'string' && address.value.includes(';') ? String(address.value).split(';')[1] ?? null : null;
  const ports = String(address?.value).split(';') ?? [null, null];
  const updatedProtocol = data.props.find((prop) => prop.code === 'protocol');
  const updatedPassword = data.props.find((prop) => prop.code === 'password');
  const updatedID = data.props.find((prop) => prop.code === 'id');
  const updatedMode = data.props.find((prop) => prop.code === 'mode');
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

  const updatedSensorValueTTL = data.props.find((prop) => prop.code === 'sensor_value_ttl')?.value;
  const updatedTimeout = data.props.find((prop) => prop.code === 'timeout')?.value;
  const updatedPeriod = data.props.find((prop) => prop.code === 'period')?.value;
  const updatedUpdateInterval = data.props.find((prop) => prop.code === 'update_interval')?.value;

  const { numericValue: ttlNumericValue, selectedUnit: ttlUnit } = parseNumericValueWithUnit(updatedSensorValueTTL);
  const { numericValue: timeoutNumericValue, selectedUnit: timeoutUnit } = parseNumericValueWithUnit(updatedTimeout);
  const { numericValue: periodNumericValue, selectedUnit: periodUnit } = parseNumericValueWithUnit(updatedPeriod);
  const { numericValue: updateIntervalNumericValue, selectedUnit: updateIntervalUnit } = parseNumericValueWithUnit(updatedUpdateInterval);

  let numericValue = 0;
  let selectedUnit = 's';

  if (updatedPeriod !== undefined) {
    numericValue = periodNumericValue;
    selectedUnit = periodUnit;
  } else if (updatedSensorValueTTL !== undefined) {
    numericValue = ttlNumericValue;
    selectedUnit = ttlUnit;
  } else if (updatedTimeout !== undefined) {
    numericValue = timeoutNumericValue;
    selectedUnit = timeoutUnit;
  } else if (updatedUpdateInterval !== undefined) {
    numericValue = updateIntervalNumericValue;
    selectedUnit = updateIntervalUnit;
  }

  const updatedSpeed = data.props.find((prop) => prop.code === 'speed');
  const updatedDataBits = data.props.find((prop) => prop.code === 'data_bits');
  const updatedParity = data.props.find((prop) => prop.code === 'parity');
  const updatedStopBits = data.props.find((prop) => prop.code === 'stop_bits');
  const updatedTries = data.props.find((prop) => prop.code === 'tries');

  const children = data.children?.reduce((childrenAcc, child) => {
    const key = child.type as DevicePropertyKey;

    const propertyData = child.props.reduce((acc, prop) => {
      const key = prop.code as keyof DevicePropertyData;
      const value = prop.value as DevicePropertyData[keyof DevicePropertyData];
      // @ts-expect-error ///
      acc[key] = value;

      return acc;
    }, {} as DevicePropertyData);

    return {
      ...childrenAcc,
      [key]: propertyData,
    };
  }, {} as DeviceChildren) ?? {};

  const initialForm = getInitialEditDeviceFormDataByTypes(data);

  if (initialForm.props && 'address' in initialForm.props && address) {
    initialForm.props.address = String(address.value);
  }
  if ('protocol' in initialForm.props && updatedProtocol) {
    initialForm.props.protocol = updatedProtocol.value as Connection;
  }
  if ('password' in initialForm.props && updatedPassword) {
    initialForm.props.password = String(updatedPassword.value);
  }
  if ('id' in initialForm.props && updatedID) {
    initialForm.props.id = String(updatedID.value);
  }
  if ('id' in initialForm) {
    initialForm.id = data.id;
  }
  if ('sdaPort' in initialForm) {
    initialForm.sdaPort = Number(ports[0]);
  }
  if ('sclPort' in initialForm) {
    initialForm.sclPort = Number(ports[1]);
  }
  if ('busAddress' in initialForm && updatedbusAddress !== null) {
    initialForm.busAddress = Number(updatedbusAddress);
  }
  if ('interface' in initialForm.props) {
    initialForm.props.interface = updatedInterface;
  }
  if ('status' in initialForm && data.status) {
    initialForm.status = data.status;
  }
  if ('mode' in initialForm.props && updatedMode) {
    initialForm.props.mode = String(updatedMode.value);
  }
  if ('ip' in initialForm.props) {
    initialForm.props.ip = ip ?? rawConnectionString;
  }
  if ('port' in initialForm.props) {
    initialForm.props.port = port ? Number(port) : null;
  }
  if ('numericValue' in initialForm.props) {
    initialForm.props.numericValue = numericValue;
  }
  if ('selectedUnit' in initialForm.props) {
    initialForm.props.selectedUnit = selectedUnit;
  }
  if ('speed' in initialForm.props && updatedSpeed) {
    initialForm.props.speed = String(updatedSpeed.value);
  }
  if ('data_bits' in initialForm.props && updatedDataBits) {
    initialForm.props.data_bits = Number(updatedDataBits.value);
  }
  if ('parity' in initialForm.props && updatedParity) {
    initialForm.props.parity = String(updatedParity.value);
  }
  if ('stop_bits' in initialForm.props && updatedStopBits) {
    initialForm.props.stop_bits = String(updatedStopBits.value);
  }

  if ('tries' in initialForm.props && updatedTries) {
    initialForm.props.tries = Number(updatedTries.value);
  }
  if (Object.keys(children).length > 0 && initialForm.children) {
    initialForm.children = children;
  }
  return initialForm;
};
