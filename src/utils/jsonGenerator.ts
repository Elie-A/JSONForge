import crypto from 'crypto';
import RandExp from 'randexp';

const ALPHA_NUM = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-';

const SUPPORTED_DATE_FORMATS: string[] = [
    "YYYY-MM-DD",
    "YYYY/MM/DD",
    "YYYY-MMM-DD",
    "YYYY/MMM/DD",
    "DD-MM-YYYY",
    "DD/MMM/YYYY",
    "DD-MMM-YYYY",
    "DD/MMM/YYYY"
];

const MONTH_ABBREVIATIONS: string[] = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const COUNTRIES_CODE_PHONE: Record<string, RegExp> = {
    "AF": /\+93 \(\d{3}\) \d{3}-\d{4}/,
    "AL": /\+355 \d{2} \d{3} \d{4}/,
    "DZ": /\+213 \d{2} \d{3} \d{4}/,
    "AD": /\+376 \d{3} \d{3}/,
    "AO": /\+244 \d{3} \d{3} \d{3}/,
    "AG": /\+1 \(268\) \d{3}-\d{4}/,
    "AR": /\+54 \(\d{3}\) \d{3}-\d{4}/,
    "AM": /\+374 \d{2} \d{6}/,
    "AU": /\+61 \d \d{4} \d{4}/,
    "AT": /\+43 \(\d{3}\) \d{7}/,
    "AZ": /\+994 \(\d{2}\) \d{3}-\d{2}-\d{2}/,
    "BS": /\+1 \(242\) \d{3}-\d{4}/,
    "BH": /\+973 \d{4}-\d{4}/,
    "BD": /\+880 \d{2} \d{7}/,
    "BB": /\+1 \(246\) \d{3}-\d{4}/,
    "BY": /\+375 \(\d{2}\) \d{3}-\d{2}-\d{2}/,
    "BE": /\+32 \(\d{3}\) \d{2} \d{2} \d{2}/,
    "BZ": /\+501 \d{7}/,
    "BJ": /\+229 \d{2} \d{2} \d{4}/,
    "BT": /\+975 17-\d{2}-\d{4}/,
    "BO": /\+591 \d{3} \d{5}/,
    "BA": /\+387 \d{2} \d{3} \d{3}/,
    "BW": /\+267 \d{2} \d{5}/,
    "BR": /\+55 \(\d{2}\) \d{4}-\d{4}/,
    "BN": /\+673 \d{3} \d{4}/,
    "BG": /\+359 \(\d{3}\) \d{3}-\d{3}/,
    "BF": /\+226 \d{2} \d{2} \d{4}/,
    "BI": /\+257 \d{2} \d{2} \d{4}/,
    "CV": /\+238 \(\d{3}\) \d{2} \d{2}/,
    "KH": /\+855 \d{2} \d{3} \d{3}/,
    "CM": /\+237 \d{3} \d{2} \d{2} \d{2}/,
    "CA": /\+1 \(\d{3}\) \d{3}-\d{4}/,
    "CF": /\+236 \d{2} \d{2} \d{4}/,
    "TD": /\+235 \d{2} \d{2} \d{2} \d{2}/,
    "CL": /\+56 \(\d\{1\}\) \d{4} \d{4}/,
    "CN": /\+86 \d{2} \d{4} \d{4}/,
    "CO": /\+57 \(\d{3}\) \d{3}-\d{4}/,
    "KM": /\+269 \d{2} \d{2} \d{2}/,
    "CG": /\+242 \d{2} \d{3} \d{4}/,
    "CD": /\+243 \d{2} \d{3} \d{4}/,
    "CR": /\+506 \d{4} \d{4}/,
    "CI": /\+225 \d{2} \d{2} \d{2} \d{2}/,
    "HR": /\+385 \(\d{2}\) \d{3} \d{3}/,
    "CU": /\+53 \d{3} \d{3} \d{2}/,
    "CY": /\+357 \d{2} \d{3} \d{3}/,
    "CZ": /\+420 \d{3} \d{3} \d{3}/,
    "DK": /\+45 \d{2} \d{2} \d{2} \d{2}/,
    "DJ": /\+253 \d{2} \d{2} \d{2} \d{2}/,
    "DM": /\+1 \(767\) \d{3}-\d{4}/,
    "DO": /\+1 \(809\) \d{3}-\d{4}/,
    "EC": /\+593 \d{2} \d{3} \d{4}/,
    "EG": /\+20 \d{2} \d{3} \d{4}/,
    "SV": /\+503 \d{4} \d{4}/,
    "GQ": /\+240 \d{3} \d{3} \d{3}/,
    "ER": /\+291 \d{2} \d{3} \d{3}/,
    "EE": /\+372 \d{4} \d{4}/,
    "SZ": /\+268 \d{2} \d{3} \d{4}/,
    "ET": /\+251 \d{2} \d{3} \d{3} \d{3}/,
    "FJ": /\+679 \d{3} \d{4}/,
    "FI": /\+358 \d{2} \d{3} \d{4}/,
    "FR": /\+33 \(0\d{1}\) \d{2} \d{2} \d{2} \d{2}/,
    "GA": /\+241 \d{2} \d{2} \d{2}/,
    "GM": /\+220 \d{3} \d{4}/,
    "GE": /\+995 \d{3} \d{3} \d{3}/,
    "DE": /\+49 \(\d{3}\) \d{3}-\d{4}/,
    "GH": /\+233 \d{2} \d{3} \d{4}/,
    "GR": /\+30 \d{3} \d{4} \d{3}/,
    "GD": /\+1 \(473\) \d{3}-\d{4}/,
    "GT": /\+502 \d{4} \d{4}/,
    "GN": /\+224 \d{3} \d{3} \d{3}/,
    "GW": /\+245 \d{1} \d{4} \d{4}/,
    "GY": /\+592 \d{3} \d{4}/,
    "HT": /\+509 \d{2} \d{2} \d{4}/,
    "HN": /\+504 \d{4} \d{4}/,
    "HU": /\+36 \d{2} \d{3} \d{3}/,
    "IS": /\+354 \d{3} \d{4}/,
    "IN": /\+91 \d{5} \d{5}/,
    "ID": /\+62 \d{2} \d{3} \d{4} \d{4}/,
    "IR": /\+98 \d{3} \d{3} \d{4}/,
    "IQ": /\+964 \d{3} \d{3} \d{4}/,
    "IE": /\+353 \d{2} \d{3} \d{4}/,
    "IL": /\+972 \d \d{3} \d{4}/,
    "IT": /\+39 \d{3} \d{3} \d{4}/,
    "JM": /\+1 \(876\) \d{3}-\d{4}/,
    "JP": /\+81 \d{1} \d{4} \d{4}/,
    "JO": /\+962 \d{2} \d{3} \d{4}/,
    "KZ": /\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/,
    "KE": /\+254 \d{2} \d{3} \d{4}/,
    "KI": /\+686 \d{2} \d{4}/,
    "KP": /\+850 \(\d{2}\) \d{3}-\d{4}/,
    "KR": /\+82 \d{2} \d{4} \d{4}/,
    "KW": /\+965 \d{4} \d{4}/,
    "KG": /\+996 \(\d{3}\) \d{3}-\d{3}/,
    "LA": /\+856 \d{2} \d{3} \d{4}/,
    "LV": /\+371 \d{3} \d{4}/,
    "LB": /\+961 \d{2} \d{3} \d{3}/,
    "LS": /\+266 \d{2} \d{2} \d{4}/,
    "LR": /\+231 \d{2} \d{6}/,
    "LY": /\+218 \d{2} \d{3} \d{4}/,
    "LI": /\+423 \d{3} \d{4}/,
    "LT": /\+370 \(\d{3}\) \d{3}-\d{2}/,
    "LU": /\+352 \d{4} \d{4}/,
    "MG": /\+261 \d{2} \d{2} \d{4} \d{2}/,
    "MW": /\+265 \d \d{4} \d{4}/,
    "MY": /\+60 \d{2} \d{4} \d{4} \d{4}/,
    "MV": /\+960 \d{3} \d{4}/,
    "ML": /\+223 \d{2} \d{2} \d{4}/,
    "MT": /\+356 \d{2} \d{2} \d{4}/,
    "MH": /\+692 \d{3} \d{4}/,
    "MR": /\+222 \d{2} \d{2} \d{4}/,
    "MU": /\+230 \d{3} \d{4}/,
    "MX": /\+52 \(\d{3}\) \d{3}-\d{4}/,
    "FM": /\+691 \d{3} \d{4}/,
    "MD": /\+373 \d{3} \d{4}/,
    "MC": /\+377 \d{2} \d{2} \d{2} \d{2}/,
    "MN": /\+976 \d{2} \d{2} \d{4}/,
    "ME": /\+382 \d{2} \d{3} \d{3}/,
    "MA": /\+212 \(\d{2}\) \d{2}-\d{4}-\d{2}/,
    "MZ": /\+258 \d{2} \d{4} \d{3}/,
    "MM": /\+95 \d{2} \d{3} \d{4}/,
    "NA": /\+264 \d{2} \d{3} \d{4}/,
    "NR": /\+674 \d{2} \d{4}/,
    "NP": /\+977 \d{2} \d{4} \d{3}/,
    "NL": /\+31 \d{2} \d{9}/,
    "NZ": /\+64 \(\d{2}\) \d{4} \d{4} \d{4}/,
    "NI": /\+505 \d{4} \d{4}/,
    "NE": /\+227 \d{2} \d{2} \d{4}/,
    "NG": /\+234 \d{3} \d{3} \d{4}/,
    "MK": /\+389 \d{2} \d{3} \d{3}/,
    "NO": /\+47 \d{3} \d{2} \d{3}/,
    "OM": /\+968 \d{4} \d{4}/,
    "PK": /\+92 \d{2} \d{7}/,
    "PW": /\+680 \d{3} \d{4}/,
    "PA": /\+507 \d{3} \d{4}/,
    "PG": /\+675 \d{3} \d{4}/,
    "PY": /\+595 \(\d{2}\) \d{3}-\d{4}/,
    "PE": /\+51 \(\d{2}\) \d{3}-\d{4}/,
    "PH": /\+63 \(\d{3}\) \d{3}-\d{4}/,
    "PL": /\+48 \d{3} \d{3} \d{3}/,
    "PT": /\+351 \d{3} \d{3} \d{3}/,
    "QA": /\+974 \d{4} \d{4}/,
    "RO": /\+40 \d{3} \d{3} \d{3}/,
    "RU": /\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/,
    "RW": /\+250 \d{2} \d{3} \d{4}/,
    "KN": /\+1 \(869\) \d{3}-\d{4}/,
    "LC": /\+1 \(758\) \d{3}-\d{4}/,
    "VC": /\+1 \(784\) \d{3}-\d{4}/,
    "WS": /\+685 \d{2} \d{4}/,
    "SM": /\+378 \d{2} \d{2} \d{2}/,
    "ST": /\+239 \d{2} \d{4}/,
    "SA": /\+966 \d{3} \d{3} \d{4}/,
    "SN": /\+221 \d{2} \d{3} \d{4}/,
    "RS": /\+381 \d{2} \d{3} \d{4}/,
    "SC": /\+248 \d \d{3} \d{3}/,
    "SL": /\+232 \d{2} \d{3} \d{3}/,
    "SG": /\+65 \d{4} \d{4}/,
    "SK": /\+421 \d{3} \d{3} \d{3}/,
    "SI": /\+386 \d{2} \d{3} \d{3}/,
    "SB": /\+677 \d{3} \d{3}/,
    "SO": /\+252 \d{2} \d{3} \d{3}/,
    "ZA": /\+27 \d{2} \d{3} \d{4}/,
    "SS": /\+211 \d{2} \d{3} \d{3}/,
    "ES": /\+34 \d{3} \d{3} \d{3}/,
    "LK": /\+94 \d{2} \d{4} \d{4}/,
    "SD": /\+249 \d{2} \d{3} \d{4}/,
    "SR": /\+597 \d{3} \d{4}/,
    "SE": /\+46 \(\d{2}\) \d{3} \d{3}/,
    "CH": /\+41 \d{2} \d{3} \d{2} \d{2}/,
    "SY": /\+963 \d{2} \d{3} \d{4}/,
    "TW": /\+886 \d \d{4} \d{4}/,
    "TJ": /\+992 \d{3} \d{2} \d{4}/,
    "TZ": /\+255 \d{2} \d{3} \d{4}/,
    "TH": /\+66 \d{2} \d{3} \d{4}/,
    "TL": /\+670 \d{3} \d{4}/,
    "TG": /\+228 \d{2} \d{2} \d{4}/,
    "TO": /\+676 \d{6}/,
    "TT": /\+1 \(868\) \d{3}-\d{4}/,
    "TN": /\+216 \d{2} \d{3} \d{3}/,
    "TR": /\+90 \(\d{3}\) \d{3}-\d{4}/,
    "TM": /\+993 \d{2} \d{3} \d{3}/,
    "TV": /\+688 \d{2} \d{3}/,
    "UG": /\+256 \(\d{2}\) \d{3}-\d{4}/,
    "UA": /\+380 \(\d{2}\) \d{3}-\d{2}-\d{2}/,
    "AE": /\+971 \d{2} \d{3} \d{4}/,
    "GB": /\+44 \d{4} \d{3} \d{3}/,
    "US": /\+1 \(\d{3}\) \d{3}-\d{4}/,
    "UY": /\+598 \d{2} \d{3} \d{4}/,
    "UZ": /\+998 \d{2} \d{3} \d{4}/,
    "VA": /\+379 \d{7}/,
    "VU": /\+678 \d{3} \d{4}/,
    "VE": /\+58 \(\d{3}\) \d{3}-\d{4}/,
    "VN": /\+84 \(\d{2}\) \d{4} \d{4}/,
    "YE": /\+967 \d{3} \d{4}/,
    "ZM": /\+260 \d{2} \d{3} \d{4}/,
    "ZW": /\+263 \d{2} \d{3} \d{4}/
};

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

function generateJsonFromSchema(propertySchema: PropertySchema, propertyPath: string[]): any {
    const { type, format, pattern, enum: enumValues, useDefault, default: defaultValue, minimum, maximum, minLength, maxLength, length, items, properties, countryCode } = propertySchema;

    switch (type) {
        case 'integer':
            const minInt = minimum || 0;
            const maxInt = maximum || Number.MAX_SAFE_INTEGER;
            return useDefault && defaultValue ? defaultValue : parseInt(String(Math.random() * (maxInt - minInt + 1))) + minInt;
        case 'string':
            let generatedString: string;
            if (format && !useDefault && !countryCode) {
                generatedString = generateRandomValueFromFormat({format: format});
            } else if(countryCode && format === 'phone'){
                generatedString = generateRandomValueFromFormat({format: format, countryCode: countryCode});
            }  else if (pattern) {
                const regex = new RegExp(pattern);
                do {
                    const randExp = new RandExp(regex);
                    generatedString = randExp.gen();
                } while (!regex.test(generatedString));
            } else if (enumValues && Array.isArray(enumValues) && enumValues.length > 0) {
                generatedString = enumValues[Math.floor(Math.random() * enumValues.length)];
            } else {
                const len = length || 10;
                generatedString = useDefault && defaultValue ? defaultValue : generateRandomValue(len);
            }
            return (minLength && generatedString.length < minLength) ? generatedString.padEnd(minLength, '*').substring(0, minLength) : (maxLength && generatedString.length > maxLength) ? generatedString.substring(0, maxLength) : generatedString;
        case 'object':
            return generateObjectData(properties!, propertyPath);
        case 'array':
            return generateArrayData(items!, propertyPath);
        case 'boolean':
            const randomBytes = crypto.randomBytes(1);
            const randomBit = randomBytes[0] & 1;
            return Boolean(randomBit);
        case 'date':
            if (useDefault) {
                return defaultValue || generateRandomDate();
            } else if (format && !useDefault) {
                return generateRandomDate(format);
            } else {
                return generateRandomDate();
            }
        default:
            return defaultValue || null;
    }
}

function generateObjectData(properties: { [key: string]: PropertySchema }, propertyPath: string[]): any {
    const generatedObject: { [key: string]: any } = {};
    for (const subProperty in properties) {
        const subPropertyData = generateJsonFromSchema(properties[subProperty], propertyPath.concat([subProperty]));
        generatedObject[subProperty] = subPropertyData;
    }
    return generatedObject;
}

function generateArrayData(items: PropertySchema[], propertyPath: string[]): any[] {
    const generatedArray: any[] = [];
    for (let i = 0; i < items.length; i++) {
        const itemData = generateJsonFromSchema(items[i], propertyPath.concat(['items', i.toString()]));
        generatedArray.push(itemData);
    }
    return generatedArray;
}

function generateRandomValue(length: number): string {
    const randomBytes = crypto.randomBytes(length);
    let generatedValue = '';
    for (let i = 0; i < length; i++) {
        const index = randomBytes[i] % ALPHA_NUM.length;
        generatedValue += ALPHA_NUM.charAt(index);
    }
    return generatedValue;
}

function generateRandomValueFromFormat(options: { format?: string, countryCode?: string }): string {
    const { format, countryCode = 'FR' } = options;

    switch (format) {
        case 'email':
            return generateRandomEmail();
        case 'phone':
            return generatePhoneNumber(countryCode);
        default:
            return '';
    }
}

function generateRandomEmail(domain: string = '@example.com'): string {
    const usernameLength = 8;
    const username = generateRandomValue(usernameLength);
    return `${username}${domain}`;
}

function generateRandomDate(format?: string): string {
    let year: number | undefined, month: string | number | undefined, day: string | number | undefined;

    if (!format) {
        const currentDate = new Date();
        year = currentDate.getFullYear();
        month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        day = currentDate.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    } else if (!SUPPORTED_DATE_FORMATS.includes(format)) {
        throw new Error(`Invalid date format: ${format}`);
    }

    if (format.includes('YYYY')) {
        year = 1900 + Math.floor(Math.random() * 100);
    }

    if (format.includes('MM')) {
        month = 1 + Math.floor(Math.random() * 12);
        month = month < 10 ? '0' + month : String(month);
    } 
    if (format.includes('MMM')) {
        const randomIndex = Math.floor(Math.random() * MONTH_ABBREVIATIONS.length);
        month = MONTH_ABBREVIATIONS[randomIndex];
        month = typeof month === 'string' ? month.charAt(0).toUpperCase() + month.slice(1) : '';
    }

    if (format.includes('DD')) {
        let maxDays;
        if (year && typeof month === 'number') {
            maxDays = getMaxDays(month, year);
        } else {
            maxDays = 31;
        }
        day = 1 + Math.floor(Math.random() * maxDays);
        day = day < 10 ? '0' + day : String(day);
    }

    const dateString = format.replace(/(YYYY)|(YY)|(MM{2})|(MMM{3})|(DD)/g, (match: string): string => {
        switch (match) {
            case 'YYYY':
                return String(year);
            case 'YY':
                return String(year).slice(-2);
            case 'MM':
                return typeof month === 'number' ? month.toString().padStart(2, '0') : month as string;
            case 'MMM':
                return typeof month === 'string' ? month : '';
            case 'DD':
                return day as string;
            default:
                return match;
        }
    });

    return dateString;
}

function getMaxDays(month: number, year: number): number {
    switch (month) {
        case 2:
            return isLeapYear(year) ? 29 : 28;
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
        default:
            return 31;
    }
}

function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function generatePhoneNumber(countryCode: string): string {
    const phoneRegex = COUNTRIES_CODE_PHONE[countryCode];    
    if(!phoneRegex){
        throw new Error(`Invalid country code: ${countryCode}`);
    } else {
        const regex = new RegExp(phoneRegex);
        let phoneNumber;
        do {
            const randExp = new RandExp(regex);
            phoneNumber = randExp.gen();
        } while (!regex.test(phoneNumber));    
        return phoneNumber;
    }
}

export {
    generateJsonFromSchema
};
