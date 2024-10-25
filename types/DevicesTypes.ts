export interface Devices {
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
    methods: Method[],
    events: any
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
    events: any
}

export interface Method {
    description: string
    name: string
    params: any
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
