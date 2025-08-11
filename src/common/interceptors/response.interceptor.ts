import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        timestamp: string;
        path: string;
        method: string;
    };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse<T>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();

        return next.handle().pipe(
            map(data => {
                // If data is already a standard response, return as is
                if (data && typeof data === 'object' && 'success' in data) {
                    return data;
                }

                // If data is null, return appropriate message
                if (data === null) {
                    return {
                        success: true,
                        message: 'No data found',
                        data: null,
                        meta: {
                            timestamp: new Date().toISOString(),
                            path: request.url,
                            method: request.method,
                        },
                    };
                }

                // If data is undefined, return appropriate message
                if (data === undefined) {
                    return {
                        success: true,
                        message: 'No data available',
                        data: undefined,
                        meta: {
                            timestamp: new Date().toISOString(),
                            path: request.url,
                            method: request.method,
                        },
                    };
                }

                // If data is an array, return with count
                if (Array.isArray(data)) {
                    return {
                        success: true,
                        message: data.length === 0 ? 'No items found' : `${data.length} items retrieved successfully`,
                        data,
                        meta: {
                            timestamp: new Date().toISOString(),
                            path: request.url,
                            method: request.method,
                        },
                    };
                }

                // If data is a single object, return as is
                return {
                    success: true,
                    message: 'Operation completed successfully',
                    data,
                    meta: {
                        timestamp: new Date().toISOString(),
                        path: request.url,
                        method: request.method,
                    },
                };
            }),
        );
    }
}
