import { parseUserInput } from './src/parseUserInput';

describe('parseUserInput - Bug Hunting Tests', () => {
    
    // BUG 1: Missing required fields - function doesn't validate all fields are present
    test('should handle missing name field', () => {
        const result = parseUserInput("age:25;email:test@example.com;tags:dev");
        expect(result.name).toBeUndefined();
    });

    // BUG 2: Missing required fields - function doesn't validate all fields are present
    test('should handle missing age field', () => {
        const result = parseUserInput("name:John;email:test@example.com;tags:dev");
        expect(result.age).toBeUndefined();
    });

    // BUG 3: Missing required fields - function doesn't validate all fields are present
    test('should handle missing email field', () => {
        const result = parseUserInput("name:John;age:25;tags:dev");
        expect(result.email).toBeUndefined();
    });

    // BUG 4: Missing required fields - function doesn't validate all fields are present
    test('should handle missing tags field', () => {
        const result = parseUserInput("name:John;age:25;email:test@example.com");
        expect(result.tags).toBeUndefined();
    });

    // BUG 5: Invalid age value - parseInt returns NaN for non-numeric strings
    test('should handle invalid age (non-numeric string)', () => {
        const result = parseUserInput("name:John;age:not_a_number;email:test@example.com;tags:dev");
        expect(result.age).toBeNaN();
    });

    // BUG 6: Invalid age value - parseInt returns NaN for empty string
    test('should handle empty age value', () => {
        const result = parseUserInput("name:John;age:;email:test@example.com;tags:dev");
        expect(result.age).toBeNaN();
    });

    // BUG 7: Email validation - no validation for valid email format
    test('should handle invalid email format', () => {
        const result = parseUserInput("name:John;age:25;email:invalid-email;tags:dev");
        expect(result.email).toBe('invalid-email');
    });

    // BUG 8: Email validation - no validation for missing @ symbol
    test('should handle email without @ symbol', () => {
        const result = parseUserInput("name:John;age:25;email:testexample.com;tags:dev");
        expect(result.email).toBe('testexample.com');
    });

    // BUG 9: Tags parsing - empty tags string results in undefined
    test('should handle empty tags field', () => {
        const result = parseUserInput("name:John;age:25;email:test@example.com;tags:");
        expect(result.tags).toBeUndefined();
    });

    // BUG 10: Tags parsing - whitespace handling issues
    test('should handle tags with extra whitespace', () => {
        const result = parseUserInput("name:John;age:25;email:test@example.com;tags: dev, senior , junior");
        expect(result.tags).toEqual([' dev', ' senior ', ' junior']);
    });

    // BUG 11: Unknown keys are silently ignored - no error handling
    test('should handle unknown keys without error', () => {
        const result = parseUserInput("name:John;age:25;email:test@example.com;tags:dev;unknown:123");
        expect(result).toEqual({
            name: 'John',
            age: 25,
            email: 'test@example.com',
            tags: ['dev']
        });
    });

    // BUG 12: Empty value for name results in empty string instead of undefined
    test('should handle empty name value', () => {
        const result = parseUserInput("name:;age:25;email:test@example.com;tags:dev");
        expect(result.name).toBe('');
    });

    // BUG 13: Empty value for email results in empty string instead of undefined
    test('should handle empty email value', () => {
        const result = parseUserInput("name:John;age:25;email:;tags:dev");
        expect(result.email).toBe('');
    });

    // BUG 14: Age as float is truncated to integer
    test('should handle age as float (truncated)', () => {
        const result = parseUserInput("name:John;age:25.5;email:test@example.com;tags:dev");
        expect(result.age).toBe(25);
    });

    // BUG 15: Negative age is accepted
    test('should handle negative age value', () => {
        const result = parseUserInput("name:John;age:-5;email:test@example.com;tags:dev");
        expect(result.age).toBe(-5);
    });

    // BUG 16: Zero age is accepted
    test('should handle zero age value', () => {
        const result = parseUserInput("name:John;age:0;email:test@example.com;tags:dev");
        expect(result.age).toBe(0);
    });

    // BUG 17: Extra whitespace in key-value pairs is not handled
    test('should handle extra whitespace in key-value pairs', () => {
        const result = parseUserInput("name : John ; age : 25 ; email : test@example.com ; tags : dev");
        expect(result.name).toBe(' John ');
        expect(result.age).toBe(25);
        expect(result.email).toBe('test@example.com');
        expect(result.tags).toEqual([' dev ']);
    });

    // BUG 18: Duplicate keys - last value wins (no error handling)
    test('should handle duplicate keys (last value wins)', () => {
        const result = parseUserInput("name:John;name:Jane;age:25;email:test@example.com;tags:dev");
        expect(result.name).toBe('Jane');
    });
});
