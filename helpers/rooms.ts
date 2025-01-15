import type { RoomItem, SelectRoom } from '~/stores/rooms/roomsTypes';
import { colors } from '~/staticData/rooms';

// API
export const filterInListRoom = (rooms: RoomItem[] | undefined) => {
  if (!rooms) return [];
  let result: SelectRoom[] = [];
  rooms.forEach((room) => {
    if (room.rooms_in_group?.length) {
      result = result.concat(result, room.rooms_in_group.map((item) => ({
        name: item.name,
        code: item.id,
        inGroup: {
          color: room.style,
          name: room.name,
          code: room.id,
        }
      })));
    } else {
      result.push({
        name: room.name,
        code: room.id,
      });
    }
  });
  return result;
};
//

export const roomColor = (color: string) => {
  if (color === 'blue') return '#5398FF';
  if (color === 'yellow') return '#FFD058';
  if (color === 'orange') return '#FF9E58';
  if (color === 'green') return '#19B58F';
  if (color === 'red') return '#FF634E';
  return '#EAEFF4';
};

export const roomTextColor = (color: string) => {
  if (color === 'blue') return '#5398FF';
  if (color === 'yellow') return '#FFD058';
  if (color === 'orange') return '#FF9E58';
  if (color === 'green') return '#19B58F';
  if (color === 'red') return '#FF634E';
  return '';
};

export const itemColor = (colorRoom: string, colorBtn: string | undefined = undefined) => {
  if (colorBtn) {
    if (colorBtn === 'blue') return '#5398FF';
    if (colorBtn === 'yellow') return '#FFD058';
    if (colorBtn === 'orange') return '#FF9E58';
    if (colorBtn === 'green') return '#19B58F';
    if (colorBtn === 'red') return '#FF634E';
  } else {
    if (colorRoom === 'blue') return '#5398FF';
    if (colorRoom === 'yellow') return '#FFD058';
    if (colorRoom === 'orange') return '#FF9E58';
    if (colorRoom === 'green') return '#19B58F';
    if (colorRoom === 'red') return '#FF634E';
  }
  return '#EAEFF4';
};

export const getRoomColorByValue = (value: string) => {
  const result = colors.find((item) => item.code === value);
  return result;
};

