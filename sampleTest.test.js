const {readAndSaveSchema, generateJsonFromSchema, validateJsonFromSchema} = require('./index');

const templatePath = './templates/sampleTestTemplate.json';

(async () => {
  const propertySchema = await readAndSaveSchema(templatePath);

  if (propertySchema !== null) {
    const generatedJson = generateJsonFromSchema(propertySchema, ['root']);
    console.log('GENERATED DATA:', generatedJson);
  }
})();
