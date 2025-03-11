import {
  IconCpu2,
  IconSun,
  IconHome,
  IconPlugConnected,
  IconPlug,
  IconBolt,
  IconCloudRain,
  IconTemperatureSun,
  IconAlertSquareRounded,
  IconRun,
  IconCloudPlus,
  IconToggleRightFilled,
  IconCpu,
  IconSubtask,
  IconCurrency,
  IconAirConditioning,
  IconMan,
  IconGauge,
} from '@tabler/icons-vue';
import { Conditioner } from '~/types/DevicesEnums';

export const iconMap = {
  mega_d: IconCpu2,
  bh1750: IconSun,
  outdoor: IconHome,
  generic_input: IconPlugConnected,
  relay: IconPlug,
  cs: IconBolt,
  bme280: IconCloudRain,
  ds18b20: IconTemperatureSun,
  scd4x: IconAlertSquareRounded,
  motion: IconRun,
  presence: IconMan,
  htu21d: IconCloudPlus,
  htu31d: IconCloudPlus,
  regulator: IconToggleRightFilled,
  server: IconCpu,
  bus: IconSubtask,
  impulse_counter: IconGauge,
  wb_mrm2_mini: IconCurrency,
  ...Object.fromEntries(
    Object.values(Conditioner)
      .filter((value) => typeof value === 'string')
      .map((type) => [type, IconAirConditioning]),
  ),
} as const;

export type IconMapKey = keyof typeof iconMap;
