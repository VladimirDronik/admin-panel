import { ref } from 'vue';
import { useDevicesStore } from '~/stores/devices/devices';
import type { Controller } from '~/types/DevicesEnums';

export function useControllersViaType() {
  const controllers = ref<{ id: number; name: string }[]>([]);

  const getControllersViaType = async (type: Controller) => {
    const storeDevices = useDevicesStore();

    const { response } = await storeDevices.getDevicesApi({
      filter_by_type: type,
      type_struct: 'easy',
      with_methods: false,
    });

    controllers.value = response.list.map((sensor) => ({
      id: sensor.id,
      name: sensor.name,
    }));

    return controllers.value;
  };

  return {
    controllers,
    getControllersViaType,
  };
}
