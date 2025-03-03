// Types modules
import type { Controller } from '~/types/DevicesEnums';

export function useController() {
  // Variables
  const controllers = ref<{ id: number; name: string }[]>([]);

  // Methods
  const getController = async (type: Controller) => {
    const storeDevices = useDevicesStore();

    const { response } = await storeDevices.getDevicesApi({
      filter_by_category: 'controller',
      filter_by_type: type,
      type_struct: 'easy',
      with_methods: false,
    }, false);

    controllers.value = response.list.map((controller) => ({
      id: controller.id,
      name: controller.name,
    }));

    return controllers.value;
  };

  return {
    controllers,
    getController,
  };
}

export function useModbus() {
  const modbus = ref<{ id: number; name: string }[]>([]);

  const getModbus = async () => {
    const storeDevices = useDevicesStore();

    const { response } = await storeDevices.getDevicesApi({
      filter_by_category: 'rs485',
      filter_by_type: 'bus',
      type_struct: 'easy',
      with_methods: false,
    }, false);

    modbus.value = response.list.map((modbus) => ({
      id: modbus.id,
      name: modbus.name,
    }));

    return modbus.value;
  };

  return {
    modbus,
    getModbus,
  };
}
