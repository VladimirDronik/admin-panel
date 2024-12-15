import type {
  DeviceCreateFormPayload, FormDataToTransform, EditDeviceForm, DeviceEditFormPayload, DeviceProps,
} from '~/components/devices/form.types';
import { Sensor } from '~/types/DevicesEnums';

export const transformToDeviceCreateFormPayload = (
  formData: FormDataToTransform,
): DeviceCreateFormPayload => ({
  object: {
    parent_id: formData.parent_id,
    zone_id: formData.zone_id,
    category: formData.category,
    name: formData.name,
    type: formData.type,
    tags: formData.tags,
    props: {
      address: formData.type === Sensor.DS18B20 ? `${formData.sdaPort};${formData.busAdress}` : `${formData.sdaPort};${formData.sclPort}`,
      update_interval: formData.props.update_interval,
    },
    Children: Object.entries(formData.children).map(([key, value]) => ({
      Type: key,
      Props: value,
      Children: null,
    })),
    events: [],
  },
});

export const transformToDeviceEditFormPayload = (
  formData: EditDeviceForm,
): DeviceEditFormPayload => {
  const props: DeviceProps = {
    address: formData.type === Sensor.DS18B20 ? `${formData.sdaPort};${formData.busAdress}` : `${formData.sdaPort};${formData.sclPort}`,
    update_interval: formData.props.update_interval,
  };
  if (formData.type === Sensor.DS18B20) {
    props.interface = formData.props.interface;
  }
  return {
    id: formData.id,
    parent_id: formData.parent_id,
    zone_id: formData.zone_id,
    category: formData.category,
    name: formData.name,
    type: formData.type,
    props,
    Children: Object.entries(formData.children).map(([key, value]) => ({
      Type: key,
      Props: value,
      Children: null,
    })),
  };
};
