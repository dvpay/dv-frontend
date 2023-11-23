export function gteTime(outTime: string, interval = 300) {
  const time1 = Number(new Date());
  const time2 = Number(new Date(outTime));

  return (time1 - time2) > interval * 1000;
}
