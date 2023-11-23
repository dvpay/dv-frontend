export function image(img: string): string {
  return new URL(`../assets/img/${img}`, import.meta.url).href;
}

export function icon(icon: string): string {
  return new URL(`../assets/img/icons/${icon}`, import.meta.url).href;
}
