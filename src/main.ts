import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './global-filters/http-exception.filter';
import { AllExceptionFilter } from './global-filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /*const httpAdapterHost = app.get(HttpAdapterHost);

  /*app.enableCors({
    origin: ['http://localhost:4200', 'https://example.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,   // Allows cookies/auth headers
  });*/

  app.setGlobalPrefix('api/smart-cart');
  //app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionFilter(httpAdapterHost));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
