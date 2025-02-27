// Types modules
import { type Component } from 'vue';
import {
  Controller, Sensor, Default, Relay, Regulator, GenericInput, Conditioner, Modbus,
} from '@/types/DevicesEnums';

// Components
import SensorDS18B20Form from '~/components/forms/byTypes/SensorDS18B20Form.vue';
import SensorHTU21DForm from '~/components/forms/byTypes/SensorHTU21DForm.vue';
import SensorBH1750Form from '~/components/forms/byTypes/SensorBH1750Form.vue';
import SensorBME280Form from '~/components/forms/byTypes/SensorBME280Form.vue';
import SensorBMP280Form from '~/components/forms/byTypes/SensorBMP280Form.vue';
import SensorOutdoorForm from '~/components/forms/byTypes/SensorOutdoorForm.vue';
import SensorSCD4XForm from '~/components/forms/byTypes/SensorSCD4XForm.vue';
import SensorMotionForm from '~/components/forms/byTypes/SensorMotionForm.vue';
import SensorPresenceForm from '~/components/forms/byTypes/SensorPresenceForm.vue';
import SensorCSForm from '~/components/forms/byTypes/SensorCSForm.vue';
import ConditionerForm from '~/components/forms/byTypes/ConditionerForm.vue';

import MegaDForm from '~/components/forms/byTypes/MegaDForm.vue';
import WBMRM2miniForm from '~/components/forms/byTypes/WBMRM2miniForm.vue';
import ModbusForm from '~/components/forms/byTypes/ModbusForm.vue';
import DefaultForm from '~/components/forms/byTypes/DefaultForm.vue';

import RelayForm from '~/components/forms/byTypes/RelayForm.vue';
import GenericInputForm from '~/components/forms/byTypes/GenericInputForm.vue';
import RegulatorForm from '~/components/forms/byTypes/RegulatorForm.vue';

// Types
type DeviceType = Controller | GenericInput | Relay | Sensor | Default | Regulator | Conditioner | Modbus;

export const ConditionerTypes = [
  Conditioner.OnokomAUX1MBB,
  Conditioner.OnokomDK1MBB,
  Conditioner.OnokomGR1MBB,
  Conditioner.OnokomGR3MBB,
  Conditioner.OnokomHR1MBB,
  Conditioner.OnokomHS3MBB,
  Conditioner.OnokomHS6MBB,
  Conditioner.OnokomME1MBB,
  Conditioner.OnokomMH8MBB,
  Conditioner.OnokomTCL1MBB,
];

interface DeviceFormMapping {
  type: DeviceType;
  component: Component;
}

export const deviceFormMapping: DeviceFormMapping[] = [
  {
    type: Controller.MegaD,
    component: MegaDForm,
  },
  {
    type: Sensor.DS18B20,
    component: SensorDS18B20Form,
  },
  {
    type: Sensor.HTU21D,
    component: SensorHTU21DForm,
  },
  {
    type: Sensor.BH1750,
    component: SensorBH1750Form,
  },
  {
    type: Sensor.BME280,
    component: SensorBME280Form,
  },
  {
    type: Sensor.BMP280,
    component: SensorBMP280Form,
  },
  {
    type: Sensor.OUTDOOR,
    component: SensorOutdoorForm,
  },
  {
    type: Sensor.SCD4X,
    component: SensorSCD4XForm,
  },

  {
    type: Default.Default,
    component: DefaultForm,
  },

  {
    type: Relay.Relay,
    component: RelayForm,
  },

  {
    type: GenericInput.GenericInput,
    component: GenericInputForm,
  },

  {
    type: Regulator.Regulator,
    component: RegulatorForm,
  },

  {
    type: Sensor.MOTION,
    component: SensorMotionForm,
  },

  {
    type: Sensor.PRESENCE,
    component: SensorPresenceForm,
  },
  {
    type: Controller.WBMRM2mini,
    component: WBMRM2miniForm,
  },
  {
    type: Sensor.CS,
    component: SensorCSForm,
  },
  ...ConditionerTypes.map((ConditionerType) => ({
    type: ConditionerType,
    component: ConditionerForm,
  })),
  {
    type: Modbus.Modbus,
    component: ModbusForm,
  },
  {
    type: Sensor.HTU31D,
    component: SensorHTU21DForm,
  },
];
