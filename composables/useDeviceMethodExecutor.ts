import { switchPropMethodMap, valuePropMethodMap } from '~/staticData/methods';

export const useDeviceMethodExecutor = () => {
  const execDeviceMethod = async (
    objectId: number,
    method: string,
    args: Record<string, any> = {},
  ) => {
    await api(`${backendApi}/objects/${objectId}/exec/${method}`, {
      method: 'POST',
      body: args,
    });
  };

  const toggleProp = async (
    objectId: number,
    propCode: keyof typeof switchPropMethodMap,
    isOn: boolean,
  ) => {
    const method = switchPropMethodMap[propCode]?.[isOn ? 'on' : 'off'];
    if (!method) return;
    await execDeviceMethod(objectId, method);
  };

  const setValueProp = async (
    objectId: number,
    propCode: keyof typeof valuePropMethodMap,
    value: string | number,
  ) => {
    const method = valuePropMethodMap[propCode];
    if (!method) return;
    await execDeviceMethod(objectId, method, { [propCode]: value });
  };

  return {
    execDeviceMethod,
    toggleProp,
    setValueProp,
  };
};
