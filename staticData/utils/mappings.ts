// import { type Component } from 'vue';
// import { ObjectsCategory, ControllerType, SensorType } from './enums';

// import MegaDForm from '@/components/forms/MegaDForm.vue';
// import SensorBH1750Form from '@/components/forms/SensorBH1750Form.vue';
// import SensorBME280Form from '@/components/forms/SensorBME280Form.vue';
// import SensorBMP280Form from '@/components/forms/SensorBMP280Form.vue';
// import SensorCSForm from '@/components/forms/SensorCSForm.vue';
// import SensorDS18B20Form from '@/components/forms/SensorDS18B20Form.vue';
// import SensorHTU21DForm from '@/components/forms/SensorHTU21DForm.vue';
// import DefaultForm from '@/components/forms/DefaultForm.vue';

// interface DeviceFormMapping {
//   category: ObjectsCategory;
//   type: ControllerType | SensorType | ObjectsCategory.Default;
//   component: Component;
// }

// export const deviceFormMapping: DeviceFormMapping[] = [
//   {
//     category: ObjectsCategory.Controller,
//     type: ControllerType.MegaD,
//     component: MegaDForm,
//   },
//   {
//     category: ObjectsCategory.Sensor,
//     type: SensorType.BH1750,
//     component: SensorBH1750Form,
//   },
//   {
//     category: ObjectsCategory.Sensor,
//     type: SensorType.BME280,
//     component: SensorBME280Form,
//   },
//   {
//     category: ObjectsCategory.Sensor,
//     type: SensorType.BMP280,
//     component: SensorBMP280Form,
//   },
//   {
//     category: ObjectsCategory.Sensor,
//     type: SensorType.CS,
//     component: SensorCSForm,
//   },
//   {
//     category: ObjectsCategory.Sensor,
//     type: SensorType.DS18B20,
//     component: SensorDS18B20Form,
//   },
//   {
//     category: ObjectsCategory.Sensor,
//     type: SensorType.HTU21D,
//     component: SensorHTU21DForm,
//   },
//   {
//     category: ObjectsCategory.Default,
//     type: ObjectsCategory.Default,
//     component: DefaultForm,
//   },
// ];
