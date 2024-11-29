import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('Event Management API')
    .setDescription('API documentation for Event Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Event Management API Documentation',
  });
  
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation is available at: ${await app.getUrl()}/api-docs`);
}
bootstrap();
