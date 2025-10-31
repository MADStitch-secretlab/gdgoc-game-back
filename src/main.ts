import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5000',
      'https://port-next-gdgoc-game-front-m4h5z3nf13944b7f.sel4.cloudtype.app'

    ]
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
