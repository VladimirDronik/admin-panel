export const checkStatusText = (item: string | undefined) => {
  if (item === 'available') return 'Доступен';
  if (item === 'disabled') return 'Отключен';
  if (item === 'unavailable') return 'Недоступен';
  return 'Неопределён';
};
export const checkStatusTextSmall = (item: string | undefined) => {
  if (item === 'available') return 'Доступен';
  if (item === 'disabled') return 'Отключен';
  if (item === 'unavailable') return 'Недоступен';
  return 'Неопределён';
};

export const checkStatusBackgroundColor = (item: string | undefined) => {
  if (item === 'available') return 'tw-bg-success';
  if (item === 'disabled') return 'tw-bg-danger';
  if (item === 'unavailable') return 'tw-bg-warn';
  return 'tw-bg-info';
};

export const checkStatusTextColor = (item: string | undefined) => {
  if (item === 'available') return 'tw-text-primary';
  if (item === 'disabled') return 'tw-text-danger';
  if (item === 'unavailable') return 'tw-text-warn';
  return 'tw-text-info';
};

export const checkStatusColor = (item: string | undefined) => {
  if (item === 'available') return 'success';
  if (item === 'disabled') return 'danger';
  if (item === 'unavailable') return 'warn';
  return 'info';
};

export const checkStatusSymbol = (item: string | undefined) => {
  if (item === 'available') {
    return { symbol: '', class: 'tw-h-2.5 tw-w-2.5 tw-rounded-full tw-bg-success tw-inline-block' };
  }
  if (item === 'unavailable') {
    return { symbol: '', class: 'tw-h-2.5 tw-w-2.5 tw-rounded-full tw-bg-warn tw-inline-block' };
  }
  if (item === 'disabled') {
    return { symbol: '×', class: 'tw-text-danger tw-font-bold tw-text-xl' };
  }
  return { symbol: '?', class: 'tw-text-black tw-font-bold tw-text-l' };
};
