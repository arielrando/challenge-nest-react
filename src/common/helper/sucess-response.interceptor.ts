import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { SKIP_SUCCESS_WRAP_KEY } from 'src/common/decorators/skip-success-wrap.decorator';

@Injectable()
export class SucessResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skip = this.reflector.getAllAndOverride<boolean>(
      SKIP_SUCCESS_WRAP_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (skip) {
      return next.handle();
    }
    return next.handle().pipe(
      map((data) => {
        return {
          isSuccess: true,
          message: 'success',
          data,
          errorCode: null,
          errors: [],
        };
      }),
    );
  }
}

export const successObject = {
  message: 'success',
};
