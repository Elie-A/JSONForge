const crypto = require('crypto');

function parseLengthFromPattern(pattern) {
    // Extracts the length information from a regex pattern
    const match = pattern.match(/\{(\d+)(?:,(\d+))?\}/);
    if (match) {
        const [, first, second] = match;
        const toReturn = second ? [parseInt(first), parseInt(second)] : [parseInt(first)];
        return toReturn;
    }
    return undefined;
}

function generateDataForProperty(propertySchema, propertyPath) {
    const type = propertySchema.type;
    let length;
    let parsedLengthArray;

    if (type === 'integer') {
        const min = propertySchema.minimum || 0;
        const max = propertySchema.maximum || Number.MAX_VALUE;
        return parseInt(Math.random() * (max - min + 1)) + min;
    } else if (type === 'string') {
        const pattern = propertySchema.pattern;
        if(pattern){
            parsedLengthArray = parseLengthFromPattern(pattern);
            if (parsedLengthArray.length === 1) {
                length = parsedLengthArray[0];
            } else if (parsedLengthArray.length > 1) {
                length = Math.floor(Math.random() * (parsedLengthArray[1] - parsedLengthArray[0] + 1)) + parsedLengthArray[0];
            }
        } else {
            length = propertySchema.length || 10; // Default length if not provided in the pattern or schema
        }

        const regex = pattern ? new RegExp(pattern) : undefined;

        if (regex) {
            let generatedString;
            do {
                generatedString = generateRandomString(length);
            } while (!regex.test(generatedString));

            return generatedString;
        } else {
            return propertySchema.useDefault && propertySchema.default ? propertySchema.default : generateRandomString(length);
        }
    } else if (type === 'object') {
        const properties = {};
        for (const subProperty in propertySchema.properties) {
            const subPropertyData = generateDataForProperty(propertySchema.properties[subProperty], propertyPath.concat([subProperty]));
            properties[subProperty] = subPropertyData;
        }
        return properties;
    } else if (type === 'array') {
        const items = [];
        const itemType = propertySchema.items.type;
        for (let i = 0; i < items.length; i++) {
            const itemData = generateDataForProperty(itemType, propertyPath.concat(['items']));
            items.push(itemData);
        }
        return items;
    } else {
        // For types other than integer, string, object, and array
        const useDefault = propertySchema.useDefault || false;
        const defaultValue = propertySchema.default;
        return useDefault && defaultValue ? defaultValue : (propertySchema.default || null);
    }
}

function generateRandomString(length) {
    const randomBytes = crypto.randomBytes(length);
    const ALPHA_NUM = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const index = randomBytes[i] % ALPHA_NUM.length;
        result += ALPHA_NUM.charAt(index);
    }

    return result;
}

module.exports = {
    generateDataForProperty
};