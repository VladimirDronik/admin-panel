import { ref } from 'vue';
import { useDevicesStore } from '~/stores/devices/devices';
import type { Sensor } from '~/types/DevicesEnums';

export function useControllersViaType() {
  const controllers = ref<{ id: number; name: string }[]>([]); // Указываем id как number

  const getControllersViaType = async (type: Sensor) => {
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
