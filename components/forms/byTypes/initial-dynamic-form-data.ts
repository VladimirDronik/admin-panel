import type {
  CreateDeviceInitialForm,
  FormTypes,
} from '~/components/device/form/form.types';
import type { GetCurrentDeviceResponse } from '~/components/rightBar/right-bar.types';
import {
  Controller, GenericInput, Sensor, ObjectsCategory, Connection, DeviceInterface,
  DevicePropertyKey, Relay, Regulator, RegulatorType,
  Conditioner,
} from '~/types/DevicesEnums';

const basicCreateDeviceForm = {
  sdaPort: null,
  sclPort: null,
  parent_id: 0,
  category: ObjectsCategory.Sensor,
  props: {
    update_interval: '1m',
    interface: DeviceInterface['I2C'],
  },
  children: {},
};

const basicCreateConditionerForm = {
  parent_id: 0,
  category: ObjectsCategory.Conditioner,
  props: {
    address: 1,
  },
};

const createFormByTypesMap = {
  [Sensor.BH1750]: {
    ...basicCreateDeviceForm,
    children: {
      [DevicePropertyKey.Illumination]: {
        value: 0,
        value_updated_at: '',
        min_error_value: 0,
        min_threshold: 0,
        max_threshold: 65535,
        max_error_value: 65535,
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
        min_error_value: -40,
        min_threshold: -40,
        max_threshold: 85,
        max_error_value: 85,
        unit: '°C',
        write_graph: false,
      },
      [DevicePropertyKey.Humidity]: {
        value: 0,
        value_updated_at: '',
        min_error_value: 0,
        min_threshold: 0,
        max_threshold: 100,
        max_error_value: 100,
        unit: '%',
        write_graph: false,
      },
      [DevicePropertyKey.Pressure]: {
        value: 0,
        value_updated_at: '',
        min_error_value: 225,
        min_threshold: 225,
        max_threshold: 825,
        max_error_value: 825,
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
        min_error_value: -40,
        min_threshold: -40,
        max_threshold: 85,
        max_error_value: 85,
        unit: '°C',
        write_graph: false,
      },
      [DevicePropertyKey.Pressure]: {
        value: 0,
        value_updated_at: '',
        min_error_value: 225,
        min_threshold: 225,
        max_threshold: 825,
        max_error_value: 825,
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
        min_error_value: -40,
        min_threshold: -40,
        max_threshold: 105,
        max_error_value: 105,
        unit: '°C',
        write_graph: false,
      },
      [DevicePropertyKey.Humidity]: {
        value: 0,
        value_updated_at: '',
        min_error_value: 0,
        min_threshold: 0,
        max_threshold: 100,
        max_error_value: 100,
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
        min_error_value: -40,
        min_threshold: -40,
        max_threshold: 85,
        max_error_value: 85,
        unit: '°C',
        write_graph: false,
      },
      [DevicePropertyKey.Pressure]: {
        value: 0,
        value_updated_at: '',
        min_error_value: 225,
        min_threshold: 225,
        max_threshold: 825,
        max_error_value: 825,
        unit: 'mmHg',
        write_graph: false,
      },
      [DevicePropertyKey.Humidity]: {
        value: 0,
        value_updated_at: '',
        min_error_value: 0,
        min_threshold: 0,
        max_threshold: 100,
        max_error_value: 100,
        unit: '%',
        write_graph: false,
      },
      [DevicePropertyKey.Illumination]: {
        value: 0,
        value_updated_at: '',
        min_error_value: 0,
        min_threshold: 0,
        max_threshold: 65535,
        max_error_value: 65535,
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
        min_error_value: -10,
        min_threshold: -10,
        max_threshold: 60,
        max_error_value: 60,
        unit: '°C',
        write_graph: false,
      },
      [DevicePropertyKey.Humidity]: {
        value: 0,
        value_updated_at: '',
        min_error_value: 0,
        min_threshold: 0,
        max_threshold: 95,
        max_error_value: 95,
        unit: '%',
        write_graph: false,
      },
      [DevicePropertyKey.CO2]: {
        value: 0,
        value_updated_at: '',
        min_error_value: 400,
        min_threshold: 400,
        max_threshold: 2000,
        max_error_value: 2000,
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
      update_interval: '1m',
    },
    children: {
      [DevicePropertyKey.Temperature]: {
        value: 0,
        value_updated_at: '',
        min_error_value: -55,
        min_threshold: -55,
        max_threshold: 125,
        max_error_value: 125,
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
      interface: DeviceInterface['MEGAIN'],
      period: 8,
      mode: 'P',
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
      interface: DeviceInterface['MEGAIN'],
      period: 120,
      mode: 'P',
    },
    children: {
      [DevicePropertyKey.Motion]: {
        max_error_value: 2,
        max_threshold: 2,
        min_error_value: -1,
        min_threshold: -1,
        unit: '',
        value: 0,
        value_updated_at: '',
        write_graph: true,
      },
      [DevicePropertyKey.Presence]: {
        max_error_value: 2,
        max_threshold: 2,
        min_error_value: -1,
        min_threshold: -1,
        unit: '',
        value: 0,
        value_updated_at: '',
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
    props: {
      interface: DeviceInterface['MEGAIN'],
      mode: '',
    },
  },
  [Relay.Relay]: {
    sdaPort: null,
    parent_id: 0,
    category: ObjectsCategory.Relay,
    props: {
      interface: DeviceInterface['MEGAOUT'],
    },
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
  [Sensor.CS]: {
    sdaPort: 0,
    parent_id: 0,
    category: ObjectsCategory.Sensor,
    props: {
      interface: DeviceInterface['ADC'],
      update_interval: '1m',
    },
    children: {
      [DevicePropertyKey.Current]: {
        value: 0,
        value_updated_at: '',
        min_error_value: 0,
        min_threshold: 0,
        max_threshold: 10,
        max_error_value: 10,
        unit: 'u',
        write_graph: false,
      },
    },
  },
  [Controller.WBMRM2mini]: {
    category: ObjectsCategory.Controller,
    props: {
      id: '',
      password: '',
      protocol: Connection.HTTP,
      address: '',
    },
    children: {},
  },
  [Conditioner.OnokomAUX1MBB]: {
    ...basicCreateConditionerForm,
  },
  [Conditioner.OnokomDK1MBB]: {
    ...basicCreateConditionerForm,
  },
  [Conditioner.OnokomGR1MBB]: {
    ...basicCreateConditionerForm,
  },
  [Conditioner.OnokomGR3MBB]: {
    ...basicCreateConditionerForm,
  },
  [Conditioner.OnokomHR1MBB]: {
    ...basicCreateConditionerForm,
  },
  [Conditioner.OnokomHS3MBB]: {
    ...basicCreateConditionerForm,
  },
  [Conditioner.OnokomHS6MBB]: {
    ...basicCreateConditionerForm,
  },
  [Conditioner.OnokomME1MBB]: {
    ...basicCreateConditionerForm,
  },
  [Conditioner.OnokomMH8MBB]: {
    ...basicCreateConditionerForm,
  },
  [Conditioner.OnokomTCL1MBB]: {
    ...basicCreateConditionerForm,
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
    update_interval: '1m',
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
    update_interval: '1m',
    interface: DeviceInterface['I2C'],
  },
  children: {},
  status: '',
};

const editFormConditionerBasicData = {
  id: 0,
  parent_id: 0,
  category: ObjectsCategory.Conditioner,
  props: {
    address: 1,
    enable: true,
    update_interval: 60,
    power_status: false,
    display_backlight: false,
    silent_mode: false,
    eco_mode: false,
    turbo_mode: false,
    sleep_mode: false,
    ionization: false,
    self_cleaning: false,
    sounds: false,
    operating_mode: '3',
    fan_speed: '0',
    horizontal_slats_mode: '1',
    vertical_slats_mode: '1',
  },
  status: '',
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
      update_interval: '1m',
    },
    children: {},
    status: '',
  },
  [Sensor.CS]: {
    id: 0,
    sdaPort: 0,
    parent_id: 0,
    props: {
      interface: DeviceInterface['ADC'],
      update_interval: '1m',
    },
    children: {},
    status: '',
  },
  [Sensor.MOTION]: {
    id: 0,
    parent_id: 0,
    sdaPort: null,
    props: {
      enable: false,
      period: 8,
      mode: 'P',
      interface: DeviceInterface['MEGAIN'],
    },
    children: {},
    status: '',
  },
  [Sensor.PRESENCE]: {
    id: 0,
    parent_id: 0,
    sdaPort: null,
    sclPort: null,
    props: {
      enable: false,
      period: 120,
      mode: 'P',
      interface: DeviceInterface['MEGAIN'],
    },
    children: {},
    status: '',
  },
  [Controller.MegaD]: {
    id: 0,
    props: {
      address: '',
      id: '',
      password: '',
      protocol: Connection.HTTP,
    },
    status: '',
  },
  [GenericInput.GenericInput]: {
    id: 0,
    sdaPort: null,
    parent_id: 0,
    props: {
      interface: DeviceInterface['MEGAIN'],
      mode: '',
    },
    status: '',
  },
  [Relay.Relay]: {
    id: 0,
    sdaPort: null,
    parent_id: 0,
    props: {
      interface: DeviceInterface['MEGAOUT'],
    },
    status: '',
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
    status: '',
  },
  [Controller.WBMRM2mini]: {
    category: ObjectsCategory.Controller,
    props: {
      id: '',
      password: '',
      protocol: Connection.HTTP,
      address: '',
    },
    children: {},
    status: '',
  },
  [Conditioner.OnokomAUX1MBB]: editFormConditionerBasicData,
  [Conditioner.OnokomDK1MBB]: editFormConditionerBasicData,
  [Conditioner.OnokomGR1MBB]: editFormConditionerBasicData,
  [Conditioner.OnokomGR3MBB]: editFormConditionerBasicData,
  [Conditioner.OnokomHR1MBB]: editFormConditionerBasicData,
  [Conditioner.OnokomHS3MBB]: editFormConditionerBasicData,
  [Conditioner.OnokomHS6MBB]: editFormConditionerBasicData,
  [Conditioner.OnokomME1MBB]: editFormConditionerBasicData,
  [Conditioner.OnokomMH8MBB]: editFormConditionerBasicData,
  [Conditioner.OnokomTCL1MBB]: editFormConditionerBasicData,
};

export const getInitialEditDeviceFormDataByTypes = (data: GetCurrentDeviceResponse) => ({
  ...editFormByTypesMap[data.type], name: data.name, zone_id: data.zone_id, type: data.type, parent_id: data.parent_id,
}) as typeof initialEditFormData;
