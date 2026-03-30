import { SetMetadata } from '@nestjs/common';

export const SKIP_SUCCESS_WRAP_KEY = 'skipSuccessWrap';

/** Evita que SucessResponseInterceptor envuelva la respuesta (p. ej. SSE). */
export const SkipSuccessWrap = () => SetMetadata(SKIP_SUCCESS_WRAP_KEY, true);
