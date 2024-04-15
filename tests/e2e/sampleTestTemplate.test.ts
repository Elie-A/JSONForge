import { readAndSaveSchema, generateJsonFromSchema } from '../../index';

const templatePath = './templates/sampleTestTemplate.json';

test('generateJsonFromSchema should generate valid JSON data', async () => {
  const propertySchema = await readAndSaveSchema(templatePath);

  if (propertySchema !== null) {
    const generatedJson = generateJsonFromSchema(propertySchema, ['root']);
    // console.log(JSON.stringify(generatedJson, null, 2));
    expect(typeof generatedJson).toBe('object');
  } else {
    fail('Failed to load property schema');
  }
});
