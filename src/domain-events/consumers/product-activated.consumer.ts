import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  PRODUCT_ACTIVATED,
  ProductActivatedEvent,
} from 'src/domain/events';
import { DomainEventBroadcasterService } from '../domain-event-broadcaster.service';
import { ProductAvailabilityNotifierStub } from '../services/product-availability-notifier.stub';

@Injectable()
export class ProductActivatedConsumer {
  constructor(
    private readonly availabilityNotifier: ProductAvailabilityNotifierStub,
    private readonly sseBridge: DomainEventBroadcasterService,
  ) {}

  @OnEvent(PRODUCT_ACTIVATED)
  handleProductActivated(event: ProductActivatedEvent): void {
    this.availabilityNotifier.notifyProductNowAvailable(event);
    this.sseBridge.push(PRODUCT_ACTIVATED, {
      productId: event.productId,
      merchantId: event.merchantId,
      occurredAt: event.occurredAt.toISOString(),
    });
  }
}
