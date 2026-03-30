import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  PRODUCT_CREATED,
  ProductCreatedEvent,
} from 'src/domain/events';
import { DomainEventBroadcasterService } from '../domain-event-broadcaster.service';
import { ProductDraftIndexSchedulerStub } from '../services/product-draft-index-scheduler.stub';

@Injectable()
export class ProductCreatedConsumer {
  constructor(
    private readonly draftIndexScheduler: ProductDraftIndexSchedulerStub,
    private readonly sseBridge: DomainEventBroadcasterService,
  ) {}

  @OnEvent(PRODUCT_CREATED)
  handleProductCreated(event: ProductCreatedEvent): void {
    this.draftIndexScheduler.scheduleDraftForLaterIndexing(event);
    this.sseBridge.push(PRODUCT_CREATED, {
      productId: event.productId,
      merchantId: event.merchantId,
      categoryId: event.categoryId,
      occurredAt: event.occurredAt.toISOString(),
    });
  }
}
