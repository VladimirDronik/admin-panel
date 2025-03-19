export const periodInText = (time: string) => {
  let result = `Каждые ${time.replace('s', '').replace('m', '').replace('h', '')} `;
  if (time.includes('s')) result += 'секунд';
  if (time.includes('m')) result += 'минут';
  if (time.includes('h')) result += 'часов';
  return result;
};
