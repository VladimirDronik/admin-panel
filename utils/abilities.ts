import { AbilityBuilder, PureAbility, type AbilityClass } from '@casl/ability';

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type Subjects = 'Device' | 'Room' | 'all';
export type AppAbility = PureAbility<[Actions, Subjects]>;

// Функция для создания правил доступа
export const defineAbilitiesFor = (user: { id: number; type: string }) => {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility as AbilityClass<AppAbility>);

  switch (user.type) {
    case 'user':
      can('read', 'Device'); // Пользователь может читать устройства
      can('update', 'Device', { ownerId: { $eq: user.id } }); // Редактировать только свои устройства
      cannot('delete', 'Device'); // Нельзя удалять устройства
      break;

    case 'admin':
      can('manage', 'Device'); // Полный доступ к устройствам
      can('manage', 'Room'); // Полный доступ к комнатам
      break;

    case 'superadmin':
      can('manage', 'all'); // Полный доступ ко всему
      break;

    default:
      cannot('manage', 'all'); // Нет доступа
      break;
  }

  return build();
};
