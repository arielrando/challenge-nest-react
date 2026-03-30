import { Injectable, MessageEvent } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

/**
 * Puente en memoria: los consumidores de dominio publican aquí y el endpoint SSE
 * reenvía al cliente (demostración punta a punta de “efectos asíncronos” visibles en UI).
 */
@Injectable()
export class DomainEventBroadcasterService {
  private readonly source = new Subject<MessageEvent>();

  push(type: string, payload: Record<string, unknown>): void {
    this.source.next({
      data: JSON.stringify({
        type,
        payload,
        at: new Date().toISOString(),
      }),
    });
  }

  stream$(): Observable<MessageEvent> {
    return this.source.asObservable();
  }
}
