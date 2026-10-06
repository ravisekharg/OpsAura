import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface ApiResponse<T> {
  data: T
  meta?: Record<string, unknown>
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((payload) => {
        // If the handler already returns { data, meta }, pass through as-is
        if (payload && typeof payload === 'object' && 'data' in payload) {
          return payload
        }
        return { data: payload }
      }),
    )
  }
}
