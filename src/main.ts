import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './global-filters/http-exception.filter';
import { AllExceptionFilter } from './global-filters/all-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,   // Allows cookies/auth headers
  });

  app.setGlobalPrefix('api/smart-cart');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // Removes all extra fields that are not in your DTO
    forbidNonWhitelisted: true, //If a request contains unknown fields → THROW error.
    transform: true //Automatically converts input types to DTO types
  }));
  app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionFilter(httpAdapterHost));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
