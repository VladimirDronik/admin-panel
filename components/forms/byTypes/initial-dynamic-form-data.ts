import type {
  CreateDeviceInitialForm,
  FormTypes,
} from '~/components/devices/form.types';
import type { GetCurrentDeviceResponse } from '~/components/rightBar/right-bar.types';
import {
  Controller, GenericInput, Sensor, ObjectsCategory, Connection, DeviceInterface,
  DevicePropertyKey, Relay, Regulator, RegulatorType,
} from '~/types/DevicesEnums';

const basicCreateDeviceForm = {
  sdaPort: null,
  sclPort: null,
  parent_id: 0,
  category: ObjectsCategory.Sensor,
  props: {
    update_interval: 300,
  },
  children: {},
};

const createFormByTypesMap = {
  [Sensor.BH1750]: {
    ...basicCreateDeviceForm,
    children: {
      [DevicePropertyKey.Illumination]: {
        value: 0,
        value_updated_at: '',
        min_error_value: -1,
        min_threshold: 0,
        max_threshold: 65535,
        max_error_value: 65536,
        unit: 'lx',
        write_graph: false,
      },
    },
  },
  [Sensor.BME280]: {
    ...basicCreateDeviceForm,
    children: {
      [DevicePropertyKey.Temperature]: {
        value: 0,
        value_updated_at: '',
        min_error_value: -41,
        min_threshold: -40,
        max_threshold: 85,
        max_error_value: 86,
        unit: '°C',
        write_graph: false,
      },
      [DevicePropertyKey.Humidity]: {
        value: 0,
        value_updated_at: '',
        min_error_value: -1,
        min_threshold: 0,
        max_threshold: 100,
        max_error_value: 101,
        unit: '%',
        write_graph: false,
      },
      [DevicePropertyKey.Pressure]: {
        value: 0,
        value_updated_at: '',
        min_error_value: 224,
        min_threshold: 225,
        max_threshold: 825,
        max_error_value: 826,
        unit: 'mmHg',
        write_graph: false,
      },
    },
  },
  [Sensor.BMP280]: {
    ...basicCreateDeviceForm,
    children: {
      [DevicePropertyKey.Temperature]: {
        value: 0,
        value_updated_at: '',
        min_error_value: -41,
        min_threshold: -40,
        max_threshold: 85,
        max_error_value: 86,
        unit: '°C',
        write_graph: false,
      },
      [DevicePropertyKey.Pressure]: {
        value: 0,
        value_updated_at: '',
        min_error_value: 224,
        min_threshold: 225,
        max_threshold: 825,
        max_error_value: 826,
        unit: 'mmHg',
        write_graph: false,
      },

    },
  },
  [Sensor.HTU21D]: {
    ...basicCreateDeviceForm,
    children: {
      [DevicePropertyKey.Temperature]: {
        value: 0,
        value_updated_at: '',
        min_error_value: -41,
        min_threshold: -40,
        max_threshold: 105,
        max_error_value: 106,
        unit: '°C',
        write_graph: false,
      },
      [DevicePropertyKey.Humidity]: {
        value: 0,
        value_updated_at: '',
        min_error_value: -1,
        min_threshold: 0,
        max_threshold: 100,
        max_error_value: 101,
        unit: '%',
        write_graph: false,
      },
    },
  },
  [Sensor.OUTDOOR]: {
    ...basicCreateDeviceForm,
    children: {
      [DevicePropertyKey.Temperature]: {
        value: 0,
        value_updated_at: '',
        min_error_value: -41,
        min_threshold: -40,
        max_threshold: 85,
        max_error_value: 86,
        unit: '°C',
        write_graph: false,
      },
      [DevicePropertyKey.Pressure]: {
        value: 0,
        value_updated_at: '',
        min_error_value: 224,
        min_threshold: 225,
        max_threshold: 825,
        max_error_value: 826,
        unit: 'mmHg',
        write_graph: false,
      },
      [DevicePropertyKey.Humidity]: {
        value: 0,
        value_updated_at: '',
        min_error_value: -1,
        min_threshold: 0,
        max_threshold: 100,
        max_error_value: 101,
        unit: '%',
        write_graph: false,
      },
      [DevicePropertyKey.Illumination]: {
        value: 0,
        value_updated_at: '',
        min_error_value: -1,
        min_threshold: 0,
        max_threshold: 65535,
        max_error_value: 65536,
        unit: 'lx',
        write_graph: false,
      },

    },
  },
  [Sensor.SCD4X]: {
    ...basicCreateDeviceForm,
    children: {
      [DevicePropertyKey.Temperature]: {
        value: 0,
        value_updated_at: '',
        min_error_value: -11,
        min_threshold: -10,
        max_threshold: 60,
        max_error_value: 61,
        unit: '°C',
        write_graph: false,
      },
      [DevicePropertyKey.Humidity]: {
        value: 0,
        value_updated_at: '',
        min_error_value: -1,
        min_threshold: 0,
        max_threshold: 95,
        max_error_value: 96,
        unit: '%',
        write_graph: false,
      },
      [DevicePropertyKey.CO2]: {
        value: 0,
        value_updated_at: '',
        min_error_value: 399,
        min_threshold: 400,
        max_threshold: 2000,
        max_error_value: 2001,
        unit: 'ppm',
        write_graph: false,
      },
    },
  },
  [Sensor.DS18B20]: {
    sdaPort: 0,
    busAddress: 0,
    parent_id: 0,
    category: ObjectsCategory.Sensor,
    props: {
      interface: DeviceInterface['1W'],
      update_interval: 300,
    },
    children: {
      [DevicePropertyKey.Temperature]: {
        value: 0,
        value_updated_at: '',
        min_error_value: -41,
        min_threshold: -40,
        max_threshold: 100,
        max_error_value: 101,
        unit: '°C',
        write_graph: false,
      },
    },
  },
  [Sensor.MOTION]: {
    parent_id: 0,
    sdaPort: 0,
    category: ObjectsCategory.Sensor,
    props: {
      enable: false,
      interface: DeviceInterface['DISCRETE'],
      period: 8,
    },
    children: {
      [DevicePropertyKey.Motion]: {
        max_error_value: 2,
        max_threshold: 2,
        min_error_value: -1,
        min_threshold: -1,
        unit: '',
        value: 1.00,
        value_updated_at: '02.11.2024 08:48:44',
        write_graph: true,
      },

    },
  },
  [Sensor.PRESENCE]: {
    parent_id: 0,
    sdaPort: 0,
    sclPort: 0,
    category: ObjectsCategory.Sensor,
    props: {
      enable: false,
      interface: DeviceInterface['DISCRETE'],
      period: 8,
    },
    children: {
      [DevicePropertyKey.Motion]: {
        max_error_value: 2,
        max_threshold: 2,
        min_error_value: -1,
        min_threshold: -1,
        unit: '',
        value: 1.00,
        value_updated_at: '02.11.2024 08:48:44',
        write_graph: true,
      },
      [DevicePropertyKey.Presence]: {
        max_error_value: 2,
        max_threshold: 2,
        min_error_value: -1,
        min_threshold: -1,
        unit: '',
        value: 1.00,
        value_updated_at: '02.11.2024 08:48:44',
        write_graph: true,
      },
    },
  },
  [Controller.MegaD]: {
    category: ObjectsCategory.Controller,
    props: {
      id: '',
      password: '',
      protocol: Connection.HTTP,
      address: '',
    },
    children: {},
  },
  [GenericInput.GenericInput]: {
    sdaPort: null,
    parent_id: 0,
    category: ObjectsCategory.GenericInput,
    props: {},
  },
  [Relay.Relay]: {
    sdaPort: null,
    parent_id: 0,
    category: ObjectsCategory.Relay,
    props: {},
  },
  [Regulator.Regulator]: {
    parent_id: 0,
    category: ObjectsCategory.Regulator,
    props: {
      enable: false,
      type: RegulatorType.Simple,
      fallback_sensor_value_id: 0,
      sensor_value_ttl: 30,
      min_sp: 0,
      target_sp: 0,
      max_sp: 0,
      below_tolerance: 0,
      above_tolerance: 0,
      complex_tolerance: 0,
    },
  },
};

export const getInitialCreateDeviceFormDataByTypes = (initialForm: CreateDeviceInitialForm) => ({ ...createFormByTypesMap[initialForm.type], name: initialForm.name, zone_id: initialForm.zone_id });

export const initialEditFormData = {
  id: 0,
  sdaPort: 0,
  sclPort: 0,
  parent_id: 0,
  category: ObjectsCategory.Sensor,
  name: '',
  zone_id: 0,
  busAddress: 0,
  props: {
    update_interval: 300,
    interface: DeviceInterface['1W'],
    address: '',
    id: '',
    password: '',
    protocol: Connection.HTTP,
  },
  children: {},
  type: Controller.MegaD,
  status: 'N/A',
};

const editFormBasicsData = {
  id: 0,
  sdaPort: null,
  sclPort: null,
  parent_id: 0,
  props: {
    update_interval: 300,
  },
  children: {},
};

const editFormByTypesMap = {
  [Sensor.BH1750]: editFormBasicsData,
  [Sensor.BME280]: editFormBasicsData,
  [Sensor.BMP280]: editFormBasicsData,
  [Sensor.HTU21D]: editFormBasicsData,
  [Sensor.OUTDOOR]: editFormBasicsData,
  [Sensor.SCD4X]: editFormBasicsData,
  [Sensor.DS18B20]: {
    id: 0,
    sdaPort: null,
    busAddress: null,
    parent_id: 0,
    props: {
      interface: DeviceInterface['1W'],
      update_interval: 300,
    },
    children: {},
  },
  [Sensor.MOTION]: {
    id: 0,
    parent_id: 0,
    sdaPort: 0,
    props: {
      enable: false,
    },
    children: {},
  },
  [Sensor.PRESENCE]: {
    id: 0,
    parent_id: 0,
    sdaPort: 0,
    sclPort: 0,
    props: {
      enable: false,
    },
    children: {},
  },
  [Controller.MegaD]: {
    id: 0,
    props: {
      address: '',
      id: '',
      password: '',
      protocol: Connection.HTTP,
    },
  },
  [GenericInput.GenericInput]: {
    id: 0,
    sdaPort: null,
    parent_id: 0,
    props: {},
  },
  [Relay.Relay]: {
    id: 0,
    sdaPort: null,
    parent_id: 0,
    props: {},
  },
  [Regulator.Regulator]: {
    id: 0,
    props: {
      enable: false,
      type: RegulatorType.Simple,
      fallback_sensor_value_id: 0,
      sensor_value_ttl: 30,
      min_sp: 0,
      target_sp: 0,
      max_sp: 0,
      below_tolerance: 0,
      above_tolerance: 0,
      complex_tolerance: 0,
    },
  },
};

export const getInitialEditDeviceFormDataByTypes = (data: GetCurrentDeviceResponse) => ({
  ...editFormByTypesMap[data.type], name: data.name, zone_id: data.zone_id, type: data.type, parent_id: data.parent_id,
}) as typeof initialEditFormData;
