import type { EventsObject } from '@/types/ModelEventTypes';

export const itemEventTypes: EventsObject = {
  button: [
    {
      code: 'on.click',
      name: 'on_click',
      description: 'Описание',
      actions: [],
    },
  ],
  switch: [
    {
      code: 'on.change.state.on',
      name: 'change_state_on',
      description: 'Описание',
      actions: [],
    },
    {
      code: 'on.change.state.off',
      name: 'change_state_off',
      description: 'Описание',
      actions: [],
    },
  ],
};

export const deviceEventTypes: EventsObject = {
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
};
