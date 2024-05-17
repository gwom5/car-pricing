import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    //never type for data so that we don't access it. Shouldn't pass any arguments to decorator
    (data: never, context: ExecutionContext) => {
                const request = context.switchToHttp().getRequest();
                return request.currentUser;
    }
)