import type { Room } from '~/types/RoomsTypes';
import { colors } from '~/staticData/rooms';

export const filterInListRoom = (rooms: Room[] | undefined): any => {
  if (!rooms) return [];
  let result: any[] = [];
  rooms.forEach((item) => {
    if (item.rooms_in_group?.length) {
      result = result.concat(result, item.rooms_in_group.map((item) => ({
        name: item.name,
        code: item.id,
      })));
    } else {
      result.push({
        name: item.name,
        code: item.id,
      });
    }
  });
  return result;
};

export const checkStatusText = (item: string | undefined) => {
  if (item === 'ON') return 'Включено';
  if (item === 'OFF') return 'Выключено';
  return 'Неопределён';
};
export const checkStatusTextSmall = (item: string | undefined) => {
  if (item === 'ON') return 'Вкл';
  if (item === 'OFF') return 'Выкл';
  return 'Неоп';
};

export const checkStatusBackgroundColor = (item: string | undefined) => {
  if (item === 'ON') return 'tw-bg-success';
  if (item === 'OFF') return 'tw-bg-danger';
  return 'tw-bg-warn';
};

export const checkStatusTextColor = (item: string | undefined) => {
  if (item === 'ON') return 'tw-text-primary';
  if (item === 'OFF') return 'tw-text-danger';
  return 'tw-text-warn';
};

export const checkStatusColor = (item: string | undefined) => {
  if (item === 'ON') return 'success';
  if (item === 'OFF') return 'danger';
  return 'warn';
};

export const roomColor = (color: string) => {
  if (color === 'blue') return '#5398FF';
  if (color === 'yellow') return '#FFD058';
  if (color === 'orange') return '#FF9E58';
  if (color === 'green') return '#19B58F';
  return '#EAEFF4';
};

export const getRoomColorByValue = (value: string) => {
  const result = colors.find((item) => item.code === value);
  return result;
};
