import { ref, watch, type Ref } from 'vue';
import { useDevicesStore } from '~/stores/devices/devices';

export function useControllerPortsViaId(controllerId: Ref<number | null>) {
  const deviceStore = useDevicesStore();
  const formattedPorts = ref<{ label: string; value: number }[]>([]);

  const loadPorts = async () => {
    if (!controllerId.value) {
      formattedPorts.value = [];
      return;
    }
    console.log(deviceStore);
    const portsData = await deviceStore.getPortsApi(controllerId.value);
    formattedPorts.value = portsData.flatMap((group) => group.ports.map((port) => {
      let objectsText = '';
      const portObjectExists = port.objects && port.objects.length > 0;
      if (portObjectExists) {
        const joinedObjects = port.objects.join(', ');
        objectsText = joinedObjects.length > 100 ? `${joinedObjects.slice(0, 100)}...` : `(${joinedObjects})`;
      }
      const modeText = port.mode ? ` / ${port.mode}` : '';

      return {
        label: `${port.type}${modeText} [${port.number}] ${objectsText}`,
        value: port.object_id,
      };
    }));
  };

  watch(
    controllerId,
    () => {
      loadPorts();
    },
    { immediate: true },
  );

  return {
    formattedPorts,
    loadPorts,
  };
}
