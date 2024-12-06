export interface Devices {
  id: number;
  type: string;
  protocol: number;
  state: number;
  name: string;
  address: number;
  module: number;
  parent_id: number;
  category: string;
  tags: string[];
  zone_id: number | null;
  status: string;
  children?: Devices[];
  props: ModelProps[];
  methods: Method[];
  events: {
    [key: string]: Event;
  };
}

export interface Script {
  id: number;
  code: string;
  name: string;
  description: string;
  params: {
    timeout: {
      code: string;
      name: string;
      description: string;
      type: string;
    };
  };
  body: string;
}

export interface RequestScript {
  list: Script[];
  total: number;
}

export interface Event {
  code: string;
  description: string;
  name: string;
  props: [];
  target_type: string;
}
export interface RequestDevices {
  id: number;
  type: string;
  protocol: number;
  state: number;
  name: string;
  address: number;
  parent_id: number;
  module: number;
  category: string;
  zone_id: number;
  status: string;
  children?: RequestDevices[];
  props: ModelProps;
  methods: Method[];
  tags: string[];
  events: {
    [key: string]: Event;
  };
}

export interface Method {
  description: string;
  name: string;
  params: any;
}

export interface Tags {
  key: string;
}

export interface GenerateFunction {
  func: () => void;
  funcText: string;
  value: boolean;
}

export interface ModelProps {
  code: string;
  type: string;
  editable: GenerateFunction;
  name: string;
  required: GenerateFunction;
  value: any;
  values: string[];
  visible: GenerateFunction;
}

export interface RequestData {
  data: {
    response: {
      list: Devices[];
      total: number;
    };
  };
}

export interface Type {
  category: string;
  name: string;
  type: string;
}

export interface PortData {
  object_id: number;
  number: number;
  type: string;
  mode: string;
  objects: string[];
}

export interface PortDataObject {
  group: string;
  ports: PortData[];
}

export interface GetDevicesPortsResponse {
  data: {
    response: PortDataObject[];
  };
}
