import { NestInterceptor, Injectable, CallHandler, ExecutionContext } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private userService: UsersService){}

    async intercept(context: ExecutionContext, handler: CallHandler<any>) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};

        if(userId) {
            request.currentUser = await this.userService.findOne(userId);
        }

        return handler.handle();
    }
}