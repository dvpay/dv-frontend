import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDate(dateValue: string, format: string, timezoneValue = '', offset = false, showHours = true) {
  let date;

  if (offset) {
    const tzOffset = new Date().getTimezoneOffset();
    date = dayjs(dateValue).utc().utcOffset(tzOffset, true);
  } else {
    date = getDate(dateValue, timezoneValue);
  }

  if (format === 'MM-DD-YYYY HH:MM A') {
    const sMonth = padValue(date.month() + 1);
    const sDay = padValue(date.date());
    const sYear = date.year();
    let sHour = date.hour();
    const sMinute = padValue(date.minute());
    let sAMPM = 'AM';

    const iHourCheck = parseInt(sHour.toString(), 10);

    if (iHourCheck > 12) {
      sAMPM = 'PM';
      sHour = iHourCheck - 12;
    }

    if (iHourCheck === 0) {
      sHour = 12;
    }

    sHour = Number(padValue(sHour));

    if (showHours) {
      return `${sMonth}-${sDay}-${sYear} ${sHour}:${sMinute} ${sAMPM}`;
    }

    return `${sMonth}-${sDay}-${sYear}`;
  }

  const sDay = padL(date.date());
  const sMonth = padL(date.month() + 1);
  const sYear = date.year();
  const sHour = padL(date.hour());
  const sMinute = padL(date.minute());

  if (showHours) {
    return `${sDay}.${sMonth}.${sYear} ${sHour}:${sMinute}`;
  }
  return `${sDay}.${sMonth}.${sYear}`;
}

function padValue(value: number): string | number {
  return (value < 10) ? `0${value}` : value;
}

function padL(nr: number, chr = '0'): string {
  return `${nr}`.padStart(2, chr);
}

function getDate(dateValue: string, timezoneValue = '') {
  let date;
  if (timezoneValue) {
    date = dayjs.utc(dateValue).tz(timezoneValue);
  } else {
    date = dayjs(dateValue);
  }
  return date;
}
