import { Module } from '@nestjs/common';
import { ProductActivatedConsumer } from './consumers/product-activated.consumer';
import { ProductCreatedConsumer } from './consumers/product-created.consumer';
import { DomainEventBroadcasterService } from './domain-event-broadcaster.service';
import { EventsStreamController } from './events-stream.controller';
import { ProductAvailabilityNotifierStub } from './services/product-availability-notifier.stub';
import { ProductDraftIndexSchedulerStub } from './services/product-draft-index-scheduler.stub';

/**
 * Reacciones al dominio (consumidores) aisladas del módulo que emite.
 * No importa ProductModule, AuthModule, etc.
 */
@Module({
  controllers: [EventsStreamController],
  providers: [
    DomainEventBroadcasterService,
    ProductDraftIndexSchedulerStub,
    ProductAvailabilityNotifierStub,
    ProductCreatedConsumer,
    ProductActivatedConsumer,
  ],
})
export class DomainEventsModule {}
