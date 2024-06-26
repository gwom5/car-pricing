import { Module, MiddlewareConsumer } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { UsersController } from './users.controller';
import { User } from "./user.entity";
import { UsersService } from './users.service';
import { AuthService } from "./auth.service";
import { CurrentUserMiddleware } from "./middlewares/current-user.middleware";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    // * applies this middleware to every route in the application
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
