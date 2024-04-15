// Import the function to be tested
import { generateJsonFromSchema } from '../../index';

interface PropertySchema {
    type: string;
    format?: string;
    pattern?: RegExp;
    enum?: any[];
    useDefault?: boolean;
    default?: any;
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    length?: number;
    items?: PropertySchema[];
    countryCode?: string;
    required?: string[];
    properties?: { [key: string]: PropertySchema };
}

// Mocking the crypto module
jest.mock('crypto', () => ({
    randomBytes: jest.fn().mockReturnValue(Buffer.from('0123456789abcdef'))
}));

describe('generateJsonFromSchema', () => {
    test('should generate valid JSON data for string type without format', () => {
        const propertySchema: PropertySchema = {
            type: 'string'
        };
        const generatedData = generateJsonFromSchema(propertySchema, []);
        expect(typeof generatedData).toBe('string');
    });

    test('should generate valid JSON data for string type with format email', () => {
        const propertySchema: PropertySchema = {
            type: 'string',
            format: 'email'
        };
        const generatedData = generateJsonFromSchema(propertySchema, []);
        expect(typeof generatedData).toBe('string');
        expect(generatedData).toContain('@example.com');
    });

    test('should generate valid JSON data for string type with format email', () => {
        const propertySchema: PropertySchema = {
            type: 'string',
            format: 'email'
        };
        const generatedData = generateJsonFromSchema(propertySchema, []);
        expect(typeof generatedData).toBe('string');
        expect(generatedData).toContain('@example.com');
    });

    test('should generate valid JSON data for boolean type', () => {
        const propertySchema: PropertySchema = {
            type: 'boolean'
        };
        const generatedData = generateJsonFromSchema(propertySchema, []);
        expect(typeof generatedData).toBe('boolean');
    });

    test('should generate valid JSON data for array type', () => {
        const propertySchema: PropertySchema = {
            type: 'array',
            items: [{ type: 'string' }]
        };
        const generatedData = generateJsonFromSchema(propertySchema, []);
        expect(Array.isArray(generatedData)).toBe(true);
        expect(generatedData.length).toBeGreaterThan(0);
    });
});
