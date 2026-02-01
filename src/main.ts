import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import * as dotenv from 'dotenv';
import { CustomExceptionFilter } from './common/filter/custom-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new CustomExceptionFilter());

  dotenv.config();
  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
