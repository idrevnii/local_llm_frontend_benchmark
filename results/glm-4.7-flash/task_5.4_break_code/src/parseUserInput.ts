/**
 * Parsed user data structure
 */
export interface ParsedData {
    name: string;
    age: number;
    email: string;
    tags: string[];
}

/**
 * Parses user input from a form string
 * 
 * @param input - String in format "name:John;age:25;email:john@example.com;tags:developer,senior"
 * @returns Parsed data object
 * 
 * @example
 * parseUserInput("name:John;age:25;email:john@test.com;tags:dev")
 * // Returns: { name: "John", age: 25, email: "john@test.com", tags: ["dev"] }
 */
export function parseUserInput(input: string): ParsedData {
    const result: Partial<ParsedData> = {};

    // Split by semicolon to get key-value pairs
    const parts = input.split(';');

    for (const part of parts) {
        // Split by colon to separate key and value
        const [key, value] = part.split(':');

        switch (key) {
            case 'name':
                result.name = value.trim();
                break;

            case 'age':
                result.age = parseInt(value);
                break;

            case 'email':
                result.email = value.toLowerCase();
                break;

            case 'tags':
                result.tags = value.split(',');
                break;
        }
    }

    // Return as complete ParsedData
    return result as ParsedData;
}
