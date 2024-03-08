const crypto = require('crypto');
const RandExp = require('randexp');

const ALPHA_NUM = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-';

function generateDataForProperty(propertySchema, propertyPath) {
    const type = propertySchema.type;
    let length;
    let regex;

    if (type === 'integer') {
        const min = propertySchema.minimum || 0;
        const max = propertySchema.maximum || Number.MAX_VALUE;
        return parseInt(Math.random() * (max - min + 1)) + min;
    } else if (type === 'string') {
        const format = propertySchema.format;
        const pattern = propertySchema.pattern;

        if (format && !propertySchema.useDefault) {
            return generateRandomValueFromFormat(format);
        } else if (!format && pattern) {
            regex = pattern ? new RegExp(pattern) : undefined;
        } 
        if (regex) {
            let generatedString;
            do {
                const randExp = new RandExp(regex);
                generatedString = randExp.gen();
            } while (!regex.test(generatedString));

            return generatedString;
        } else {
            // Check if the property has an enum definition
            if (propertySchema.enum && Array.isArray(propertySchema.enum) && propertySchema.enum.length > 0) {
                // Select a random value from the enum list
                return propertySchema.enum[Math.floor(Math.random() * propertySchema.enum.length)];
            }
            length = propertySchema.length || 10; // Default length if not provided in the pattern or schema
            return propertySchema.useDefault && propertySchema.default ? propertySchema.default : generateRandomValue(length);
        }
    } else if (type === 'object') {
        const properties = {};
        for (const subProperty in propertySchema.properties) {
            const subPropertyData = generateDataForProperty(propertySchema.properties[subProperty], propertyPath.concat([subProperty]));
            properties[subProperty] = subPropertyData;
        }
        return properties;
    } else if (type === 'array') {
        const generatedItems = [];
        const items = propertySchema.items;

        for (let i = 0; i < items.length; i++) {
            const itemData = generateDataForProperty(items[i], propertyPath.concat(['items', i.toString()]));
            generatedItems.push(itemData);
        }
        return generatedItems;
    } else if (type === 'boolean') {
        const randomBytes = crypto.randomBytes(1);
        const randomBit = randomBytes[0] & 1; // Extract the least significant bit
        return Boolean(randomBit);
    } else {
        // For types other than integer, string, object, and array
        const useDefault = propertySchema.useDefault || false;
        const defaultValue = propertySchema.default;
        return useDefault && defaultValue ? defaultValue : (propertySchema.default || null);
    }
}

function generateRandomValue(length) {
    const randomBytes = crypto.randomBytes(length);
    let generatedValue = '';
    for (let i = 0; i < length; i++) {
        const index = randomBytes[i] % ALPHA_NUM.length;
        generatedValue += ALPHA_NUM.charAt(index);
    }

    return generatedValue;
}

function generateRandomValueFromFormat(format){
    let generatedValueFromFormat = '';
    switch (format) {
        case 'email':
            generatedValueFromFormat = generateRandomEmail();
            return generatedValueFromFormat;
        default:
            return generatedValueFromFormat;
    }
}

function generateRandomEmail(){
    const usernameLength = 8;
    const username = generateRandomValue(usernameLength);
    const domain = '@example.com';
    return `${username}${domain}`;
}

module.exports = {
    generateDataForProperty
};