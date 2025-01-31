import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core'
// Static Data modules
import { paths } from '~/utils/endpoints';
// Composable modules
import { useApiInstant } from '~/composables/Api';
import { useUserStore } from '~/stores/user';
// Helpers modules
import { filterInListDevices } from '~/helpers/devices';
// Types modules
import type {
  Devices, RequestData, ModelProps, GetDevicesPortsResponse,
} from '~/types/DevicesTypes';
// Types and Schemes
import type { APIData } from '~/types/StoreTypes';
import {
  typesListSchema, type TypeData, tagsSchema, type TagsData,
} from './devicesTypes';

export const useDevicesStore = defineStore('Devices', () => {
  // Composables
  const { api } = useApiInstant();
  const storeUser = useUserStore();
  const localState = useStorage('touchOn', {
    darkTheme: false,
    token: '',
    openSidebar: true,
    language: 'ru',
  })

  // Variables
  const list = ref<Devices[]>([]);
  const total = ref<number>(0);

  const tags = ref<APIData<TagsData> | null>();
  const types = ref<APIData<TypeData[]> | null>();

  const userAccessLevel = ref<number>(3);

  // Computed Properties
  const getDevices = computed(() => filterInListDevices(list.value, 0, ''));

  const findbyCategoryDevices = (list: any, type: string) => {
    let result: any[] = []
    list.forEach((item: any) => {
      if (item.children) result = [...result, ...findbyCategoryDevices(item.children, type)]
      if (item.category === type) result.push(item)
    })
    return result
  }

  const filterByCategoryDevices = computed(() => findbyCategoryDevices(list.value, 'relay'));

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

  const getTypesApi = async (params = {}, refreshable = true) => {
    if (types.value && refreshable) {
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
        token: localState.value.token,
      },
    });

    if (updateStore) {
      list.value = data.response.list;
      total.value = data.response.total;
    }

    return data;
  };

  const getPortsApi = async (id: number, group: string = 'inputs,digital') => {
    try {
      const { data }: GetDevicesPortsResponse = await api.get(`${paths.controllers}/${id}/ports`, {
        params: { group },
      });

      return data.response || [];
    } catch (error) {
      console.error('Ошибка при получении портов:', error);
      throw error;
    }
  };

  return {
    list,
    tags,
    total,
    types,
    getDevices,
    filterByCategoryDevices,
    userAccessLevel,
    getDevicesApi,
    getTypesApi,
    getTagsApi,
    propsModel,
    createFunction,
    getPortsApi,
  };
});
