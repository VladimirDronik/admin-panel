import { defineStore } from 'pinia';
import { useApiInstant } from '~/composables/api/apiInstant';
// Helpers
import { filterInListDevices } from '~/helpers/devices';
// Types
import type {
  Devices, Type, RequestData, ModelProps, RequestDevices, Tags,
} from '~/types/DevicesTypes';

export const useDevicesStore = defineStore('Devices', () => {
  // Composables
  const storeAuth = useAuthStore();
  const { api } = useApiInstant();

  // Variables
  const list = ref<Devices[]>([]);
  const total = ref<number>(0);
  const tags = ref<Tags[]>([]);
  const item = ref<Devices | null>();
  const types = ref<Type[]>([]);
  const model = ref<Devices | null>();
  const userAccessLevel = ref<any>(3);

  // Computed Properties
  const getDevices = computed(() => filterInListDevices(list.value, 0, ''));

  // Methods
  const createFunction = (functionBody: string, props = {}) => {
    const func = new Function('userAccessLevel', 'props', functionBody);
    return {
      func,
      funcText: String(func),
      value: func(userAccessLevel.value, props),
    };
  };

  const propsModel = (props: ModelProps | undefined): ModelProps[] => {
    if (!props) return [];
    const result = Object.values(props).map((item) => ({
      ...item,
      required: item.required ? createFunction(item.required, props) : false,
      editable: item.editable ? createFunction(item.editable, props) : false,
      visible: item.visible ? createFunction(item.visible, props) : false,
    }));
    return result;
  };

  const getDevicesApi = async (params = {}) => {
    const { data }: RequestData = await api('http://10.35.16.1:8082/objects', {
      params,
      headers: {
        token: storeAuth.token,
      },
    });

    list.value = data.data.list;
    total.value = data.data.total;
    return data;
  };

  const getTypesApi = async (params = {}) => {
    const { data }: { data: { data: Type[] } } = await api('http://10.35.16.1:8082/objects/types', {
      params,
      headers: {
        token: storeAuth.token,
      },
    });

    types.value = data.data;
    return data;
  };

  const getTagsApi = async (params = {}) => {
    const { data }: { data: { data: any[] } } = await api('http://10.35.16.1:8082/objects/tags', {
      params,
      headers: {
        token: storeAuth.token,
      },
    });

    tags.value = data.data;
    return data;
  };

  const getModelApi = async (params = {}) => {
    const data: { data: { data: RequestDevices }} = await api('http://10.35.16.1:8082/objects/model', {
      params,
      headers: {
        token: storeAuth.token,
      },
    });

    const result = {
      ...data.data.data,
      props: propsModel(data.data.data.props),
      children: data.data.data.children?.map((item) => ({
        ...item,
        props: propsModel(item.props) ?? [],
      })),
    } as Devices;

    model.value = result;
    return data;
  };

  const createDeviceApi = async (params = {}) => {
    const { data }: { data: Type[] } = await api.post(
      'http://10.35.16.1:8082/objects',
      {
        ...params,
      },
      {
        headers: {
          'api-key': 'c041d36e381a835afce48c91686370c8',
          token: storeAuth.token,
        },
      },
    );
    return data;
  };

  const changeDeviceApi = async (params = {}) => {
    const { data }: { data: Type[] } = await api.put('http://10.35.16.1:8082/objects', {
      data: params,
      headers: {
        'api-key': 'c041d36e381a835afce48c91686370c8',
        token: storeAuth.token,
      },
    });
    return data;
  };

  const getControllerDetailsApi = async (id: number) => {
    const { data }: {data: {data: RequestDevices}} = await api.get(
      `http://10.35.16.1:8082/objects/${id}`,
      {
        headers: {
          token: storeAuth.token,
        },
      },
    );

    const result = {
      ...data.data,
      props: propsModel(data.data.props),
      children: data.data.children?.map((item) => ({
        ...item,
        props: propsModel(item.props) ?? [],
      })),
    } as Devices;

    item.value = result;
    return data;
  };
  const deleteDeviceApi = async (id: number) => {
    const data: {data: RequestDevices} = await api.delete(
      `http://10.35.16.1:8082/objects/${id}`,
      {
        headers: {
          token: storeAuth.token,
        },
      },
    );

    return data;
  };

  return {
    list,
    tags,
    total,
    item,
    types,
    model,
    getDevices,
    userAccessLevel,
    getDevicesApi,
    getTypesApi,
    getModelApi,
    getTagsApi,
    propsModel,
    createDeviceApi,
    changeDeviceApi,
    createFunction,
    deleteDeviceApi,
    getControllerDetailsApi,
  };
});
