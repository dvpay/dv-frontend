import i18n from '@/plugins/i18n';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDateSummary({ date, locale, range }: Record<string, string>): string {
  const tzOffset = new Date().getTimezoneOffset();
  const now = dayjs().utcOffset(tzOffset, true);
  const dateValue = dayjs(date).utcOffset(tzOffset, true);
  const dayDiff = now.diff(dateValue, 'day');

  if (range === 'day') {
    if (dayDiff === 0) {
      return i18n.global.t('Today');
    }
    if (dayDiff === 1) {
      return i18n.global.t('Yesterday');
    }
    if (dayDiff === 6) {
      return i18n.global.t('Week revenue');
    }
    if (dayDiff === 30) {
      return i18n.global.t('Month revenue');
    }
  }
  return dateValue.locale(locale).format('DD MMM YYYY');
}
