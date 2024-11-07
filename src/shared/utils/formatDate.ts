import i18n from '../config/i18n/i18n';

export function formatDate(date: Date) {
  return date
    .toLocaleString(i18n.language, {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(' at', ',')
    .replace(' в', '');
}

export function formatDateShorter (date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100;

    const formattedMonth = month < 10 ? `0${month}` : `${month}`;

    return `${day}.${formattedMonth}.${year}`;
}
