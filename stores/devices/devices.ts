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
  Devices, RequestData, ModelProps, RequestDevices, Tags, RequestScript,
} from '~/types/DevicesTypes';
// Types and Schemes
import type { APIData } from '~/types/StoreTypes';
import {
  typesListSchema, type TypeData,
  tagsSchema, type TagsData,
  devicesListSchema, type FullDevice,
} from './devicesTypes';

export const useDevicesStore = defineStore('Devices', () => {
  // Composables
  const { api } = useApiInstant();
  const storeUser = useUserStore();

  // Variables
  const list = ref<Devices[]>([]);
  const total = ref<number>(0);

  const tags = ref<APIData<TagsData> | null>();
  const types = ref<APIData<TypeData[]> | null>();

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

  const getTypesApi = async (params = {}) => {
    if (types.value) {
      types.value.refresh();
    } else {
      const data: unknown = await useAPI(
        paths.objectsTypes,
        {
          params,
        },
        typesListSchema,
      );

      types.value = data as APIData<TypeData[]>;
    }
  };

  const getTagsApi = async (params = {}) => {
    if (tags.value) {
      tags.value.refresh();
    } else {
      const data: unknown = await useAPI(
        paths.objectsTags,
        {
          params,
        },
        tagsSchema,
      );

      tags.value = data as APIData<TagsData>;
    }
  };

  const getDevicesApi = async (params = {}, updateStore: boolean = true) => {
    const { data }: RequestData = await api.get(paths.objects, {
      params,
      headers: {
        token: storeUser.userLocal?.token,
      },
    });

    if (updateStore) {
      list.value = data.response.list;
      total.value = data.response.total;
    }

    return data;
  };

  const getPortsApi = async (id: number) => {
    const { data }: { data: { response: any[] } } = await api.get(`${objectManager}/controllers/${id}/ports`, {
      headers: {
        token: storeUser.userLocal?.token,
      },
    });

    ports.value = data.response;
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
    const data: { data: { response: RequestDevices }} = await api.get(paths.objectModel, {
      params,
      headers: {
        token: storeUser.userLocal?.token,
      },
    });

    const result = {
      ...data.data.response,
      props: propsModel(data.data.response.props),
      children: data.data.response.children?.map((item) => ({
        ...item,
        props: propsModel(item.props) ?? [],
      })),
    } as Devices;

    model.value = result;
    return data;
  };

  const createDeviceApi = async (params = {}) => {
    const { data }: { data: any } = await api.post(
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

    const { data }: { data: any[] } = await api.put(
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
    const { data }: {data: {response: RequestDevices}} = await api.get(
      `${paths.objects}/${id}`,
      {
        params,
        headers: {
          token: storeUser.userLocal?.token,
        },
      },
    );

    const result = {
      ...data.response,
      props: propsModel(data.response.props),
      children: data.response.children?.map((item) => ({
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
