const json_generator = require('./utils/jsonGenerator');
const json_validator = require('./utils/jsonValidator');
const common = require('./utils/common');

module.exports = {
    generateJsonFromSchema: json_generator.generateDataForProperty,
    readAndSaveSchema: common.readAndSaveSchema,
    validateJsonFromSchema: json_validator.validateJsonFromSchema
};