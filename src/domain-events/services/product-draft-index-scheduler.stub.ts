import { Injectable, Logger } from '@nestjs/common';
import { ProductCreatedEvent } from 'src/domain/events';

/**
 * Punto de extensión: búsqueda, proyecciones CQRS, cola de trabajo, etc.
 * Sin acoplar ProductModule a este servicio.
 */
@Injectable()
export class ProductDraftIndexSchedulerStub {
  private readonly logger = new Logger(ProductDraftIndexSchedulerStub.name);

  scheduleDraftForLaterIndexing(event: ProductCreatedEvent): void {
    this.logger.log(
      `Stub: borrador de producto ${event.productId} (merchant ${event.merchantId}) listo para indexación diferida`,
    );
  }
}
