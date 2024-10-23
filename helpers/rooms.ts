import type { Room } from '~/types/RoomsTypes'

export const filterInListRoom = (rooms: Room[] | undefined): any => {
  if (!rooms) return [];
  const result: any[] = [];
  rooms.forEach((item) => {
    if (item.rooms_in_group?.length) {
      result.push({
        title: item.name,
        props: {
          value: item.id,
        },
      });
      // result = result.concat(item.rooms_in_group.map((item) => ({
      //   title: item.name,
      //   props: {
      //     value: item.id,
      //   },
      // })));
    } else {
      result.push({
        title: item.name,
        props: {
          value: item.id,
        },
      });
    }
  });
  return result;
}

export const checkStatusText = (item: string) => {
  if (item === 'ON') return 'Включено';
  if (item === 'OFF') return 'Выключено';
  return 'Неопределён';
};

export const checkStatusColor = (item: string) => {
  if (item === 'ON') return 'bg-success';
  if (item === 'OFF') return 'bg-error';
  return 'bg-warning';
};

export const roomColor = (color: string) => {
  if (color === 'blue') return '#5398FF';
  if (color === 'yellow') return '#FFD058';
  if (color === 'orange') return '#FF9E58';
  if (color === 'green') return '#19B58F';
  return '#EAEFF4';
};