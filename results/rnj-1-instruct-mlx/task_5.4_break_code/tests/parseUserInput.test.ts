import { parseUserInput } from '../src/parseUserInput';

describe('parseUserInput', () => {
  // Test case 1: Missing fields
  test('should handle missing optional fields', () => {
    const result = parseUserInput('name:John');
    expect(result).toEqual({
      name: 'John',
      age: 0, // parseInt returns 0 for empty string
      email: '',
      tags: ['']
    });
    // Bug: Missing fields should have default values or be undefined
  });

  // Test case 2: Empty input
  test('should handle empty input', () => {
    const result = parseUserInput('');
    expect(result).toEqual({
      name: '',
      age: NaN, // parseInt('') returns NaN
      email: '',
      tags: ['']
    });
    // Bug: Empty input should return empty strings or arrays
  });

  // Test case 3: Invalid age format
  test('should handle invalid age format', () => {
    const result = parseUserInput('name:John;age:twenty');
    expect(result).toEqual({
      name: 'John',
      age: NaN, // parseInt('twenty') returns NaN
      email: '',
      tags: ['']
    });
    // Bug: Age should be validated and default to 0 or throw error
  });

  // Test case 4: Extra whitespace
  test('should handle extra whitespace', () => {
    const result = parseUserInput('name:  John Doe  ;age:  30  ');
    expect(result).toEqual({
      name: 'John Doe', // trim() works correctly
      age: 30,
      email: '',
      tags: ['']
    });
    // Note: Name trimming works correctly
  });

  // Test case 5: Empty tags
  test('should handle empty tags', () => {
    const result = parseUserInput('name:John;tags:');
    expect(result).toEqual({
      name: 'John',
      age: 0,
      email: '',
      tags: [''] // split(',') on empty string returns ['']
    });
    // Bug: Empty tags should return empty array
  });

  // Test case 6: Multiple semicolons
  test('should handle multiple consecutive semicolons', () => {
    const result = parseUserInput('name:John;;;age:25');
    expect(result).toEqual({
      name: 'John',
      age: 25,
      email: '',
      tags: ['']
    });
    // Note: Empty parts are ignored in split
  });

  // Test case 7: Missing colon
  test('should handle missing colon', () => {
    const result = parseUserInput('nameJohn;age:25');
    expect(result).toEqual({
      name: '', // split('John') returns ['nameJohn'], so value is undefined
      age: 25,
      email: '',
      tags: ['']
    });
    // Bug: Should handle malformed key-value pairs
  });

  // Test case 8: Extra fields
  test('should handle extra fields', () => {
    const result = parseUserInput('name:John;age:25;extra:value');
    expect(result).toEqual({
      name: 'John',
      age: 25,
      email: '',
      tags: ['']
    });
    // Note: Extra fields are ignored
  });
});
