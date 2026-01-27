export function parseUserInput(input: string): Record<string, any> {
  if (!input) return {};
  
  const pairs = input.split(';');
  const result: Record<string, any> = {};

  for (const pair of pairs) {
    const [key, value] = pair.split(':');
    if (key && value) {
      // Простой случай: ключ и значение
      result[key.trim()] = value.trim();
    }
  }

  return result;
}
