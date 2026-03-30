import { Injectable, Logger } from '@nestjs/common';
import { ProductActivatedEvent } from 'src/domain/events';

/**
 * Punto de extensión: notificar canales externos, invalidar caché, webhooks.
 */
@Injectable()
export class ProductAvailabilityNotifierStub {
  private readonly logger = new Logger(ProductAvailabilityNotifierStub.name);

  notifyProductNowAvailable(event: ProductActivatedEvent): void {
    this.logger.log(
      `Stub: producto ${event.productId} activo; catálogo/terceros podrían actualizarse (merchant ${event.merchantId})`,
    );
  }
}
