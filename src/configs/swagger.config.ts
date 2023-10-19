import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Printer site documentation')
  .setDescription(
    'This documentation helps people who work with the client side',
  )
  .setVersion('1.0')
  .addBearerAuth({
    // I was also testing it without prefix 'Bearer ' before the JWT
    description: `[just text field] Please enter token in following format: Bearer <JWT>`,
    name: 'Authorization',
    bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
    scheme: 'Bearer',
    type: 'http', // I`ve attempted type: 'apiKey' too
    in: 'Header',
  })
  .build();
