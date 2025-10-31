import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidUnknownValues: false,
  }));

  app.enableCors({
    origin: [
      'http://localhost:5000',
      'https://port-next-gdgoc-game-front-m4h5z3nf13944b7f.sel4.cloudtype.app'

    ]
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
