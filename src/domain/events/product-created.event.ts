/**
 * Ocurre cuando existe un borrador de producto persistido (aún no publicado en catálogo).
 */
export class ProductCreatedEvent {
  constructor(
    readonly productId: number,
    readonly merchantId: number,
    readonly categoryId: number,
    readonly occurredAt: Date = new Date(),
  ) {}
}
