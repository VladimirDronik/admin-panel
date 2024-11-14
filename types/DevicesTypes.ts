export interface Devices {
    id: number,
    type: number,
    protocol: number,
    state: number,
    name: string,
    address: number,
    module: number,
    category: string,
    tags: string[],
    zone_id: number
    status: string
    children?: Devices[]
    props: ModelProps[]
    methods: Method[],
    events: {
        [key: string]: Event
    }
}

export interface Script {
    id: number,
    code: string,
    name: string,
    description: string,
    params: {
        timeout: {
        code: string,
        name: string,
        description: string,
        type: string
        }
    },
    body: string
}

export interface RequestScript {
    list: Script[]
    total: number
}

export interface Event {
    code: string,
    description: string,
    name: string,
    props: [],
    target_type: string,
}
export interface RequestDevices {
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
    children?: RequestDevices[]
    props: ModelProps,
    methods: Method[],
    events: {
        [key: string]: Event
    }
}

export interface Method {
    description: string
    name: string
    params: any
}

export interface Tags {
    key: string
}

export interface GenerateFunction {
    func: () => void,
    funcText: string,
    value: boolean,
}

export interface ModelProps {
    code: string,
    type: string,
    editable: GenerateFunction,
    name: string,
    required: GenerateFunction,
    value: any,
    values: string[]
    visible: GenerateFunction,
}

export interface RequestData {
    data: {
        data: {
            list: Devices[]
            total: number
        }
    }
}

export interface Type {
    category: string
    name: string
    type: string
}
