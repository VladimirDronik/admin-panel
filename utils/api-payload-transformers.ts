import type {
  DeviceCreateFormPayload, FormDataToTransform, EditDeviceForm, DeviceEditFormPayload, DeviceChildren,
  DevicePropertyData,
} from '~/components/devices/form.types';
import { getInitialEditDeviceFormDataByTypes } from '~/components/forms/byTypes/initial-dynamic-form-data';
import type { GetCurrentDeviceResponse } from '~/components/rightBar/right-bar.types';
import type { DevicePropertyKey, Connection } from '~/types/DevicesEnums';
import {
  Sensor, Controller, Relay, GenericInput,
  DeviceInterface,
  Regulator,
} from '~/types/DevicesEnums';

const createAddress = (formData: FormDataToTransform | EditDeviceForm): string => {
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

export const transformToDeviceCreateFormPayload = (
  formData: FormDataToTransform,
): DeviceCreateFormPayload => {
  const children = formatChildren(formData.children);

  const result = { object: { ...formData, children, events: [] } };
  result.object.props.address = createAddress(formData);

  if (!formData.children && 'children' in result.object) {
    // @ts-expect-error ///
    delete result.object['children'];
  }

  if (formData.type === Regulator.Regulator && !result.object.props.address) {
    delete result.object.props.address;
  }
  delete result.object.sdaPort;
  delete result.object.sclPort;
  delete result.object.busAddress;

  return result;
};

export const transformToDeviceEditFormPayload = (
  formData: EditDeviceForm,
): DeviceEditFormPayload => {
  const children = formatChildren(formData.children);
  const result = { ...formData, children, events: [] };
  if (formData.type !== Regulator.Regulator) {
    result.props.address = createAddress(formData);
  }
  const resultWithoutPorts = Object.fromEntries(
    Object.entries(result).filter(([key]) => key !== 'sdaPort' && key !== 'sclPort' && key !== 'busAddress'),
  );

  let finalResult = resultWithoutPorts;

  if (!formData.children && 'children' in result) {
    finalResult = Object.fromEntries(Object.entries(resultWithoutPorts).filter(([key]) => key !== 'children'));
  }

  return finalResult as DeviceEditFormPayload;
};

export const transformResponseToFormData = (data: GetCurrentDeviceResponse): EditDeviceForm | null => {
  if (!data.id) return null;
  const address = data.props.find((prop) => prop.code === 'address');
  const updatedInterval = data.props.find((prop) => prop.code === 'update_interval')?.value ?? 0;
  const updatedInterface = (data.props.find((prop) => prop.code === 'interface')?.value ?? DeviceInterface['1W']) as DeviceInterface;
  const updatedbusAddress = String(address?.value).split(';')[1];
  const ports = String(address?.value).split(';') ?? [null, null];
  const updatedProtocol = data.props.find((prop) => prop.code === 'protocol');
  const updatedPassword = data.props.find((prop) => prop.code === 'password');
  const updatedID = data.props.find((prop) => prop.code === 'id');

  const children = data.children?.reduce((childrenAcc, child) => {
    const key = child.type as DevicePropertyKey;

    const propertyData = child.props.reduce((acc, prop) => {
      const key = prop.code as keyof DevicePropertyData;
      const value = prop.value as DevicePropertyData[keyof DevicePropertyData];
      // @ts-expect-error ///
      acc[key] = value;
      return acc;
    }, {} as DevicePropertyData);

    childrenAcc[key] = propertyData;

    return childrenAcc;
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
  if ('busAddress' in initialForm) {
    initialForm.busAddress = Number(updatedbusAddress);
  }
  if ('interface' in initialForm.props) {
    initialForm.props.interface = updatedInterface;
  }
  if ('update_interval' in initialForm.props) {
    initialForm.props.update_interval = Number(updatedInterval);
  }
  if ('status' in initialForm && data.status) {
    initialForm.status = data.status;
  }
  if (Object.keys(children).length > 0 && initialForm.children) {
    initialForm.children = children;
  }
  return initialForm;
};
