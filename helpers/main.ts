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
