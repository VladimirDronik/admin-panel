import _ from 'lodash';
import type { Devices } from '~/types/DevicesTypes';

// API
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

export function updateParamsForApi(params: Devices) {
  if (_.isEmpty(params)) return undefined;

  const props: any = {};
  params.props.forEach((item) => props[item.code] = {
    ...item,
    editable: item.editable.funcText,
    required: item.required.funcText,
    visible: item.visible.funcText,
  });

  const children = params.children?.map((item) => {
    const childrenProps: any = {};
    item.props.forEach((prop) => childrenProps[prop.code] = {
      ...prop,
      editable: prop.editable.funcText,
      required: prop.required.funcText,
      visible: prop.visible.funcText,
    });
    return {
      ...item,
      props: childrenProps,
    };
  });

  const newParams: any = {
    id: params.id,
    type: params.type,
    zone_id: params.zone_id,
    protocol: params.protocol,
    category: params.category,
    name: params.name,
    status: params.status,
    events: params.events,
    props,
  };

  newParams.children = children;

  console.log(newParams);
  return newParams;
}
//

export function getActionsColor(type: string): string {
  if (type === 'method') return 'default';
  if (type === 'delay') return 'warn';
  if (type === 'script') return 'info';
  if (type === 'notification') return 'danger';
  return 'secondary';
}

export function getActionsTitle(type: string, args: any): string {
  if (type === 'method') return `Метод ${args?.name ?? '-'}`;
  if (type === 'delay') return 'Пауза';
  if (type === 'script') return 'Скрипт';
  if (type === 'notification') return 'Уведомление';
  return 'secondary';
}
