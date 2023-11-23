export function isJson(str: string | null) {
  if (typeof str === 'string') {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  return false;
}
