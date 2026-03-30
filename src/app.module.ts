import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfigService } from './database/typeorm/typeorm.service';
import { ApiModule } from './api/api.module';
import { configuration } from './config';
import { DomainEventsModule } from './domain-events/domain-events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ApiModule,
    DomainEventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
