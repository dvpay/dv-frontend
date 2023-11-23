export function removePropsFromObject(obj: Record<string, any>, props: string[]): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).filter((item) => !props.includes(item[0])),
  );
}
