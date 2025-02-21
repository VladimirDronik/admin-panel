import type { GetCheckAddressResponse } from '~/types/DevicesTypes';

export function useCheckAddressAvailability() {
  const occupiedDeviceId = ref<number>(0);
  const checking = ref<boolean>(false);

  const checkAddressAvailability = async (address: number, parentId: number) => {
    if (!address || !parentId) return;

    checking.value = true;

    const response = await api(paths.objectsByProps, {
      query: {
        props: `address=${address}`,
        parent_id: parentId,
      },
    });

    const data = response as GetCheckAddressResponse;
    occupiedDeviceId.value = data.response;

    checking.value = false;
  };

  return {
    occupiedDeviceId,
    checking,
    checkAddressAvailability,
  };
}
