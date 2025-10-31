import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReactionModule } from './reaction/reaction.module';

@Module({
  imports: [ReactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
