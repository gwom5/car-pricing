import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { plainToInstance } from "class-transformer";

interface ClassConstructor {
    new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor) {}

    intercept(
        context: ExecutionContext,
        handler: CallHandler<any>
    ): Observable<any> | Promise<Observable<any>>
    {
        // Run something before a request is handled by the request handler, before pipe.

        return handler.handle().pipe(
            map((data) => {
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                });
            })
        )
    }
}