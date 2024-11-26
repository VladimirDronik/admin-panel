import { defineStore } from 'pinia';
import _ from 'lodash';
// Static Data modules
import { paths, objectManager } from '~/staticData/endpoints';
// Composable modules
import { useApiInstant } from '~/composables/Api';
import { useUserStore } from '~/stores/user';
// Helpers modules
import { filterInListDevices, updateParamsForApi } from '~/helpers/devices';
// Types modules
import type {
  Devices, Type, RequestData, ModelProps, RequestDevices, Tags, RequestScript,
} from '~/types/DevicesTypes';

export const useDevicesStore = defineStore('Devices', () => {
  // Composables
  const { api } = useApiInstant();
  const storeUser = useUserStore();

  // Variables
  const list = ref<Devices[]>([]);
  const total = ref<number>(0);

  const tags = ref<Tags[]>([]);
  const types = ref<Type[]>([]);

  const object = ref<Devices | null>();
  const model = ref<Devices | null>();

  const ports = ref<any>();

  const userAccessLevel = ref<number>(3);

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

  const getDevicesApi = async (params = {}, updateStore: boolean = true) => {
    const { data }: RequestData = await api.get(paths.objects, {
      params,
      headers: {
        token: storeUser.userLocal?.token,
      },
    });

    if (updateStore) {
      list.value = data.data.list;
      total.value = data.data.total;
    }

    return data;
  };

  const getTypesApi = async (params = {}) => {
    const { data }: { data: { data: Type[] } } = await api.get(paths.objectsTypes, {
      params,
      headers: {
        token: storeUser.userLocal?.token,
      },
    });

    types.value = data.data;
    return data;
  };

  const getTagsApi = async (params = {}) => {
    const { data }: { data: { data: any[] } } = await api.get(paths.objectsTags, {
      params,
      headers: {
        token: storeUser.userLocal?.token,
      },
    });

    tags.value = data.data;
    return data;
  };

  const getPortsApi = async (id: number) => {
    const { data }: { data: { data: any[] } } = await api.get(`${objectManager}/controllers/${id}/ports`, {
      headers: {
        token: storeUser.userLocal?.token,
      },
    });

    ports.value = data.data;
    return data;
  };

  const createEventApi = async (target_type: string, target_id: number, event_name: string, params = {}) => {
    const { data }: { data: { data: RequestScript } } = await api.post(
      paths.eventsActions,
      params,
      {
        params: {
          target_type,
          target_id,
          event_name,
        },
        headers: {
          token: storeUser.userLocal?.token,
        },
      },
    );

    return data;
  };

  const getModelApi = async (params = {}) => {
    const data: { data: { data: RequestDevices }} = await api.get(paths.objectModel, {
      params,
      headers: {
        token: storeUser.userLocal?.token,
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
      paths.objects,
      {
        ...params,
      },
      {
        headers: {
          'api-key': 'c041d36e381a835afce48c91686370c8',
          token: storeUser.userLocal?.token,
        },
      },
    );
    return data;
  };

  const changeDeviceApi = async (params: Devices) => {
    if (_.isEmpty(params)) return undefined;

    const { data }: { data: Type[] } = await api.put(
      paths.objects,
      updateParamsForApi(params),
      {
        headers: {
          'api-key': 'c041d36e381a835afce48c91686370c8',
          token: storeUser.userLocal?.token,
        },
      },
    );
    return data;
  };

  const getControllerDetailsApi = async (id: number, params: any = {}) => {
    const { data }: {data: {data: RequestDevices}} = await api.get(
      `${paths.objects}/${id}`,
      {
        params,
        headers: {
          token: storeUser.userLocal?.token,
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

    object.value = result;
    return result;
  };

  const changeActionOrderApi = async (params = {}) => {
    const data: {data: RequestDevices} = await api.put(
      paths.eventsActionsOrder,
      params,
      {
        headers: {
          'api-key': 'c041d36e381a835afce48c91686370c8',
          token: storeUser.userLocal?.token,
        },
      },
    );

    return data;
  };

  const deleteDeviceApi = async (id: number) => {
    const data: {data: RequestDevices} = await api.delete(
      `${paths.objects}/${id}`,
      {
        headers: {
          token: storeUser.userLocal?.token,
        },
      },
    );

    return data;
  };

  const deleteActionApi = async (id: number) => {
    const data: {data: RequestDevices} = await api.delete(
      `${paths.eventsActions}/${id}`,
      {
        headers: {
          token: storeUser.userLocal?.token,
        },
      },
    );

    return data;
  };

  return {
    list,
    ports,
    tags,
    total,
    object,
    types,
    model,
    getDevices,
    userAccessLevel,
    getPortsApi,
    getDevicesApi,
    getTypesApi,
    getModelApi,
    getTagsApi,
    getControllerDetailsApi,
    propsModel,
    createDeviceApi,
    createEventApi,
    changeDeviceApi,
    changeActionOrderApi,
    createFunction,
    deleteDeviceApi,
    deleteActionApi,
  };
});
