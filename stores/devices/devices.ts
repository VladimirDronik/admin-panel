import { defineStore } from 'pinia';
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
  // Variables
  const list = ref<Devices[]>([]);
  const total = ref<number>(0);

  const tags = ref<APIData<TagsData> | null>();
  const types = ref<APIData<TypeData[]> | null>();

  const userAccessLevel = ref<number>(3);

  // Computed Properties
  const getDevices = computed(() => filterInListDevices(list.value, 0, ''));

  const findbyCategoryDevices = (list: any, type: string) => {
    let result: any[] = [];
    list.forEach((item: any) => {
      if (item.children) result = [...result, ...findbyCategoryDevices(item.children, type)];
      if (item.category === type) result.push(item);
    });
    return result;
  };

  const filterByCategoryDevices = computed(() => findbyCategoryDevices(list.value, 'relay'));


  const propsModel = (props: ModelProps | undefined): ModelProps[] => {
    if (!props) return [];
    const result = Object.values(props).map((item) => ({
      ...item,
      required: item.required ?? false,
      editable: item.editable ?? false,
      visible: item.visible ?? false,
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

  const getDevicesApi = async (query = {}, updateStore: boolean = true) => {
    const data: unknown = await api(paths.objects, {
      query,
    });

    const devices = data as RequestData;

    if (updateStore) {
      list.value = devices.response.list;
      total.value = devices.response.total;
    }

    return devices;
  };

  const getPortsApi = async (id: number, group: string = 'inputs,digital') => {
    try {
      const data: unknown = await api(`${paths.controllers}/${id}/ports`, {
        query: { group },
      });
  
      const ports = data as GetDevicesPortsResponse;
  
      return ports.response || [];
    } catch {
      return [];
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
    getPortsApi,
  };
});
