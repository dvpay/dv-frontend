export function shortName(name: string): string {
  return name.length > 15
    ? `${name.slice(0, 7)}...${name.slice(-3)}`
    : name;
}
