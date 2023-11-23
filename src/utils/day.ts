import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/ru';
import 'dayjs/locale/es';
import 'dayjs/locale/hi';

dayjs.extend(relativeTime);

export function day(date: string, locale: string) {
  return dayjs().locale(locale).fromNow();
}
