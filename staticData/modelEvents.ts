import type { EventsObject } from '@/types/ModelEventTypes';
import { Conditioner } from '~/types/DevicesEnums';

export const itemEventTypes: EventsObject = {
  button: [
    {
      code: 'item.on_change_state_on',
      name: 'on_click',
      description: 'Описание',
      actions: [],
    },
  ],
  switch: [
    {
      code: 'item.on_change_state_on',
      name: 'change_state_on',
      description: 'Описание',
      actions: [],
    },
    {
      code: 'item.on_change_state_off',
      name: 'change_state_off',
      description: 'Описание',
      actions: [],
    },
  ],
};

export const deviceEventTypes: EventsObject = {
  // Controllers
  mega_d: [
    {
      code: 'object.controller.on_load',
      name: 'on_load',
      description: 'Инициализация контроллера после включения питания',
      actions: [],
    },
    {
      code: 'object.controller.on_unavailable',
      name: 'on_unavailable',
      description: 'Контролдлер стал недоступен',
      actions: [],
    },
  ],
  // Relay
  relay: [
    {
      code: 'on_change_state',
      name: 'on_change_state',
      description: 'Изменение состояния объекта',
      actions: [],
    },
    {
      code: 'object.relay.on_state_on',
      name: 'on_state_on',
      description: 'Включение реле',
      actions: [],
    },
    {
      code: 'object.relay.on_state_off',
      name: 'on_state_off',
      description: 'Выключение реле',
      actions: [],
    },
    {
      code: 'object.relay.on_check',
      name: 'on_check',
      description: 'Проверка состояния реле',
      actions: [],
    },
  ],
  // Generic Input
  generic_input: [
    {
      code: 'object.generic_input.on_click',
      name: 'on_click',
      description: 'Одиночное замыкание',
      actions: [],
    },
    {
      code: 'object.generic_input.on_double_click',
      name: 'on_double_click',
      description: 'Двойное замыкание',
      actions: [],
    },
    {
      code: 'object.generic_input.on_long_press',
      name: 'on_long_press',
      description: 'Длительное замыкание',
      actions: [],
    },
  ],
  // Sensors
  bh1750: [
    {
      code: 'object.sensor.on_check',
      name: 'on_check',
      description: 'Данные датчика обновлены',
      actions: [],
    },
    {
      code: 'object.sensor.on_alarm',
      name: 'on_alarm',
      description: 'Данные датчика вышли за пороговые значения',
      actions: [],
    },
  ],
  bme280: [
    {
      code: 'object.sensor.on_check',
      name: 'on_check',
      description: 'Данные датчика обновлены',
      actions: [],
    },
    {
      code: 'object.sensor.on_alarm',
      name: 'on_alarm',
      description: 'Данные датчика вышли за пороговые значения',
      actions: [],
    },
  ],
  cs: [
    {
      code: 'object.sensor.on_check',
      name: 'on_check',
      description: 'Данные датчика обновлены',
      actions: [],
    },
    {
      code: 'object.sensor.on_alarm',
      name: 'on_alarm',
      description: 'Данные датчика вышли за пороговые значения',
      actions: [],
    },
  ],
  ds18b20: [
    {
      code: 'object.sensor.on_check',
      name: 'on_check',
      description: 'Данные датчика обновлены',
      actions: [],
    },
    {
      code: 'object.sensor.on_alarm',
      name: 'on_alarm',
      description: 'Данные датчика вышли за пороговые значения',
      actions: [],
    },
  ],
  htu21d: [
    {
      code: 'object.sensor.on_check',
      name: 'on_check',
      description: 'Данные датчика обновлены',
      actions: [],
    },
    {
      code: 'object.sensor.on_alarm',
      name: 'on_alarm',
      description: 'Данные датчика вышли за пороговые значения',
      actions: [],
    },
  ],
  htu31d: [
    {
      code: 'object.sensor.on_check',
      name: 'on_check',
      description: 'Данные датчика обновлены',
      actions: [],
    },
    {
      code: 'object.sensor.on_alarm',
      name: 'on_alarm',
      description: 'Данные датчика вышли за пороговые значения',
      actions: [],
    },
  ],
  outdoor: [
    {
      code: 'object.sensor.on_check',
      name: 'on_check',
      description: 'Данные датчика обновлены',
      actions: [],
    },
    {
      code: 'object.sensor.on_alarm',
      name: 'on_alarm',
      description: 'Данные датчика вышли за пороговые значения',
      actions: [],
    },
  ],
  scd4x: [
    {
      code: 'object.sensor.on_check',
      name: 'on_check',
      description: 'Данные датчика обновлены',
      actions: [],
    },
    {
      code: 'object.sensor.on_alarm',
      name: 'on_alarm',
      description: 'Данные датчика вышли за пороговые значения',
      actions: [],
    },
  ],
  impulse_counter: [
    {
      code: 'object.impulse_counter.on_threshold',
      name: 'on_threshold',
      description: 'Достигнуто пороговое значение счетчика',
      actions: [],
    },
    {
      code: 'object.impulse_counter.on_check',
      name: 'on_check',
      description: 'Произведено снятие количества импульсов со счетчика',
      actions: [],
    },
  ],
  regulator: [
    {
      code: 'object.regulator.on_below',
      name: 'on_below',
      description: 'Текущее значение меньше заданного',
      actions: [],
    },
    {
      code: 'object.regulator.on_above',
      name: 'on_above',
      description: 'Текущее значение больше заданного',
      actions: [],
    },
    {
      code: 'object.regulator.on_stale',
      name: 'on_stale',
      description: 'Текущее значение не актуально',
      actions: [],
    },
    {
      code: 'object.regulator.on_complex_below_1',
      name: 'on_complex_below_1',
      description: 'Текущее значение < (targetSP - complexTolerance - belowTolerance)',
      actions: [],
    },
    {
      code: 'object.regulator.on_complex_below_2',
      name: 'on_complex_below_2',
      description: 'Текущее значение > (targetSP + complexTolerance - belowTolerance)',
      actions: [],
    },
    {
      code: 'object.regulator.on_complex_above_1',
      name: 'on_complex_above_1',
      description: 'Текущее значение < (targetSP - complexTolerance + aboveTolerance)',
      actions: [],
    },
    {
      code: 'object.regulator.on_complex_above_2',
      name: 'on_complex_above_2',
      description: 'Текущее значение > (targetSP + complexTolerance + aboveTolerance)',
      actions: [],
    },
  ],
  motion: [
    {
      code: 'object.sensor.on_motion_on',
      name: 'on_motion_on',
      description: 'Движение есть',
      actions: [],
    },
    {
      code: 'object.sensor.on_motion_off',
      name: 'on_motion_off',
      description: 'Движения нет',
      actions: [],
    },
  ],
  presence: [
    {
      code: 'object.sensor.on_motion_on',
      name: 'on_motion_on',
      description: 'Движение есть',
      actions: [],
    },
    {
      code: 'object.sensor.on_motion_off',
      name: 'on_motion_off',
      description: 'Движения нет',
      actions: [],
    },
    {
      code: 'object.sensor.on_presence_on',
      name: 'on_presence_on',
      description: 'Присутствие есть',
      actions: [],
    },
    {
      code: 'object.sensor.on_presence_off',
      name: 'on_presence_off',
      description: 'Присутствия нет',
      actions: [],
    },
  ],
  ...Object.fromEntries(
    Object.values(Conditioner).map((type) => [
      type,
      [
        {
          code: 'object.onokom.gateway.on_check',
          name: 'on_check',
          description: 'Получение состояния устройства',
          actions: [],
        },
        {
          code: 'object.onokom.gateway.on_change',
          name: 'on_change',
          description: 'Изменение состояния устройства',
          actions: [],
        },
      ],
    ]),
  ),
};
