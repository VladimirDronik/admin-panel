import { defineStore } from 'pinia';
import { useApiInstant } from '~/composables/api/apiInstant';

interface Devices {
  id: number,
  type: number,
  protocol: number,
  state: number,
  name: number,
  address: number,
  module: number,
  category: string,
  zone_id: number
  status: string
  children?: Devices[]
  props: ModelProps[]
}
interface requsetDevices {
  id: number,
  type: number,
  protocol: number,
  state: number,
  name: number,
  address: number,
  module: number,
  category: string,
  zone_id: number
  status: string
  children?: requsetDevices[]
  props: ModelProps
}

interface GenerateFunction {
  func: () => void,
  funcText: string,
  value: boolean,
}

interface ModelProps {
  code: string,
  type: string,
  editable: GenerateFunction,
  name: string,
  required: GenerateFunction,
  value: any,
  values: string[]
  visible: GenerateFunction,
}

interface RequestData {
  data: {
    data: {
      list: Devices[]
      total: number
    }
  }
}

interface State {
  list: Devices[],
  item: Devices | null,
  total: number,
  types: Type[],
}

interface Type {
  category: string
  name: string
  type: string
}

function filterDevices(devices: Devices[], level: number, key: string): any {
  return devices.map((item, index) => {
    if (item.children) {
      return {
        key: level === 0 ? String(index) : `${key}-${index}}`,
        data: {
          id: item.id,
          category: item.category,
          name: item.name,
          type: item.type,
          address: item?.zone_id ?? '-',
          status: item?.status ?? '-',
        },
        children: filterDevices(item.children, level + 1, level === 0 ? String(index) : `0${`-${index}`.repeat(level)}`),
      };
    }
    return {
      key: level === 0 ? String(index) : `${key}-${index}`,
      data: {
        id: item.id,
        category: item.category,
        name: item.name,
        type: item.type,
        address: item?.zone_id ?? '-',
        status: item?.status ?? '-',
      },
    };
  });
}

export const useDevicesStore = defineStore('Devices', () => {
  function createFunction(functionBody: string, props = {}) {
    const func = new Function('userAccessLevel', 'props', functionBody);
    return {
      func,
      funcText: String(func),
      value: func(userAccessLevel.value, props),
    };
  }

  function propsModel(props: ModelProps | undefined): ModelProps[] {
    if (!props) return [];
    const result = Object.values(props).map((item) => ({
      ...item,
      required: item.required ? createFunction(item.required, props) : false,
      editable: item.editable ? createFunction(item.editable, props) : false,
      visible: item.visible ? createFunction(item.visible, props) : false,
    }));
    return result;
  }

  const storeAuth = useAuthStore();
  const { api } = useApiInstant();

  const list = ref<Devices[]>([]);
  const total = ref<number>(0);
  const item = ref<Devices | null>();
  const types = ref<Type[]>([]);
  const model = ref<Devices | null>();
  const userAccessLevel = ref<any>(3);

  const getDevices = computed(() => filterDevices(list.value, 0, ''));

  const getDevicesApi = async (params = {}) => {
    const { data }: { data: any} = await api('http://10.35.16.1:8088/objects', {
      params,
      headers: {
        token: storeAuth.token,
      },
    });

    list.value = data?.list;
    total.value = data?.total;
    return data;
  };

  const getTypesApi = async (params = {}) => {
    const { data }: { data: Type[] } = await api('http://10.35.16.1:8088/objects/types', {
      params,
      headers: {
        token: storeAuth.token,
      },
    });

    types.value = data;
    return data;
  };
  const getModelApi = async (params = {}) => {
    const data: { data: requsetDevices } = await api('http://10.35.16.1:8088/objects/model', {
      params,
      headers: {
        token: storeAuth.token,
      },
    });

    const result = {
      ...data.data,
      props: propsModel(data.data.props),
      children: data.data.children?.map((item) => ({
        ...item,
        props: propsModel(item.props) ?? [],
      })),
    } as Devices;

    console.log(result);

    model.value = result;
    return data;
  };

  const createDeviceApi = async (params = {}) => {
    const { data }: { data: Type[] } = await api('http://10.35.16.1:8088/objects', {
      method: 'POST',
      body: params,
      headers: {
        'api-key': 'c041d36e381a835afce48c91686370c8',
        token: storeAuth.token,
      },
    });
    return data;
  };

  const changeDeviceApi = async (params = {}) => {
    const { data }: { data: Type[] } = await api('http://10.35.16.1:8088/objects', {
      method: 'PUT',
      body: params,
      headers: {
        'api-key': 'c041d36e381a835afce48c91686370c8',
        token: storeAuth.token,
      },
    });
    return data;
  };

  const getControllerDetailsApi = async (id: number) => {
    const data: {data: requsetDevices} = await api(
      `http://10.35.16.1:8088/objects/${id}`,
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
    console.log(id);
    const data: {data: requsetDevices} = await api(
      `http://10.35.16.1:8088/objects/${id}`,
      {
        method: 'DELETE',
        headers: {
          token: storeAuth.token,
        },
      },
    );

    return data;
  };

  const logoutApi = async () => {
    const { data } = await api('api/public/user/logout', {
      methods: 'POST',
    });
    return data;
  };

  return {
    list,
    total,
    item,
    types,
    model,
    getDevices,
    userAccessLevel,
    getDevicesApi,
    getTypesApi,
    getModelApi,
    logoutApi,
    propsModel,
    createDeviceApi,
    changeDeviceApi,
    createFunction,
    deleteDeviceApi,
    getControllerDetailsApi,
  };
});
