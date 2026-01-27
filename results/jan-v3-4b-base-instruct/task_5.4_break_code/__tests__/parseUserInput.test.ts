// Тест 1: Пустая строка - функция должна вернуть пустой объект
test('empty string returns empty object', () => {
  expect(parseUserInput('')).toEqual({});
});

// Тест 2: Один ключ-значение без пробелов - должно работать
test('single key-value with no spaces works', () => {
  expect(parseUserInput('name:John')).toEqual({ name: 'John' });
});

// Тест 3: Много ключей с пробелами в значениях - значение не должно удаляться
test('values with spaces are trimmed but preserved', () => {
  expect(parseUserInput('name: John; age: 25')).toEqual({ name: 'John', age: '25' });
});

// Тест 4: Некорректный формат с лишним значением без двоеточия
test('invalid format with missing colon returns malformed data', () => {
  expect(parseUserInput('name:John;age')).toEqual({ name: 'John', age: undefined });
});

// Тест 5: Пустое значение после двоеточия (только ключ)
test('empty value after colon is treated as empty string', () => {
  expect(parseUserInput('name:;age:')).toEqual({ name: '', age: '' });
});

// Тест 6: Многочисленные теги - функция не должна разделять их
test('multiple tags are merged into one value', () => {
  expect(parseUserInput('tags:developer,senior')).toEqual({ tags: 'developer,senior' });
});

// Тест 7: Некорректный формат тегов - запятая без значения
test('tag with comma but no value is ignored', () => {
  expect(parseUserInput('tags:dev,admin')).toEqual({ tags: 'dev,admin' });
});

// Тест 8: Ошибка в парсинге при отсутствии двоеточия (все ключи без значения)
test('missing colon in key-value pair fails to parse', () => {
  expect(parseUserInput('nameJohn')).toEqual({ name: 'John' }); // Некорректный формат
});

// Тест 9: Сложные случаи с вложенными двоеточиями (например, email с символами)
test('email with special characters is parsed correctly', () => {
  expect(parseUserInput('email:john@domain.com;name:John')).toEqual({ email: 'john@domain.com', name: 'John' });
});

// Тест 10: Повторяющиеся ключи - последнее значение должно быть принято
test('duplicate keys overwrite previous values', () => {
  expect(parseUserInput('name:John;name:Jane')).toEqual({ name: 'Jane' });
});
