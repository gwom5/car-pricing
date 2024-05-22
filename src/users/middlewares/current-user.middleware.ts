import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../users.service";
import {User} from "../user.entity";

declare global {
    namespace Express {
        interface Request {
            currentUser?: User;
        }
    }
}
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usersService: UsersService) {}
    async use(request: Request, response: Response, next: NextFunction) {
        // @ts-ignore
        const { userId } = request.session || {};
        if(userId) {
            request.currentUser = await this.usersService.findOne(userId);
        }
        next();
    }
}