/**
 * Ocurre cuando un producto pasa a estado activo y podría mostrarse en el catálogo.
 */
export class ProductActivatedEvent {
  constructor(
    readonly productId: number,
    readonly merchantId: number,
    readonly occurredAt: Date = new Date(),
  ) {}
}
