import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SkipSuccessWrap } from 'src/common/decorators/skip-success-wrap.decorator';
import { DomainEventBroadcasterService } from './domain-event-broadcaster.service';

@SkipSuccessWrap()
@Controller('events')
export class EventsStreamController {
  constructor(private readonly broadcaster: DomainEventBroadcasterService) {}

  @Sse('stream')
  stream(): Observable<MessageEvent> {
    return this.broadcaster.stream$();
  }
}
