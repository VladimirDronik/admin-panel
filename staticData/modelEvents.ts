import type { EventsObject } from '@/types/ModelEventTypes';

export const itemEventTypes: EventsObject = {
  button: [
    {
      code: 'item.on_click',
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
};
