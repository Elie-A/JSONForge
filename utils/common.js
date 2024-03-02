const fs = require('fs');

async function readAndSaveSchema(filePath) {
    try {
      const jsonContent = await fs.promises.readFile(filePath, 'utf8');
      const schemaTemplate = JSON.parse(jsonContent);
      const propertySchema = schemaTemplate;

      return propertySchema;
    } catch (error) {
      console.error('Error reading or parsing the JSON file:', error.message);
      return null;
    }
}

module.exports = {
    readAndSaveSchema
}