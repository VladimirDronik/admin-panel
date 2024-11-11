import type { Devices } from '~/types/DevicesTypes';

export function filterInListDevices(devices: Devices[], level: number, key: string): any {
  return devices.map((item, index) => {
    if (item.children) {
      return {
        key: level === 0 ? String(index) : `${key}-${index}}`,
        data: {
          id: item.id,
          category: item.category,
          name: item.name,
          type: item.type,
          tags: item.tags,
          address: item?.zone_id ?? '-',
          status: item?.status ?? '-',
        },
        children: filterInListDevices(item.children, level + 1, level === 0 ? String(index) : `0${`-${index}`.repeat(level)}`),
      };
    }
    return {
      key: level === 0 ? String(index) : `${key}-${index}`,
      data: {
        id: item.id,
        category: item.category,
        name: item.name,
        type: item.type,
        tags: item.tags,
        address: item?.zone_id ?? '-',
        status: item?.status ?? '-',
      },
    };
  });
}

export function getActionsColor(type: string): string {
  if (type === 'method') return 'default';
  if (type === 'delay') return 'warn';
  if (type === 'script') return 'info';
  if (type === 'notification') return 'danger';
  return 'secondary';
}

export function getActionsTitle(type: string): string {
  if (type === 'method') return 'Метод';
  if (type === 'delay') return 'Пауза';
  if (type === 'script') return 'Скрипт';
  if (type === 'notification') return 'Уведомление';
  return 'secondary';
}
