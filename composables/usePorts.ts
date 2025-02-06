// Builtin modules
import { ref, watch, type Ref } from 'vue';

export function usePorts(controllerId: Ref<number | null>, group: string = 'inputs,digital') {
  // Composable
  const deviceStore = useDevicesStore();

  // Variables
  const formattedPorts = ref<{ label: string; value: number; number: number }[]>([]);

  // Methods
  const loadPorts = async () => {
    if (!controllerId.value) {
      formattedPorts.value = [];
      return;
    }
    const portsData = await deviceStore.getPortsApi(controllerId.value, group);
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
        number: port.number,
      };
    }));
  };

  // Watchers
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

