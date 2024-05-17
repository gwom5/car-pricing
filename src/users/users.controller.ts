import {
    Controller, Post, Body, Get,
    Param, Query, Delete, Patch,
    NotFoundException,
    Session,
    UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import {UsersService} from "./users.service";
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import {User} from "./user.entity";
import { AuthGuard } from "../guards/auth.guard";

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
    constructor(private userService: UsersService, private authService: AuthService) {}

    @Post('/signup')
    async creatUser (@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signUp(body.email, body.password);
        session.userId = user.id;

        return user;
    }

    @UseGuards(AuthGuard)
    @Get('/whoami')
    whoAmI(@CurrentUser() user: User) {
        return user
    }

    @Post('/signin')
    async signIn (@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signIn(body.email, body.password);
        session.userId = user.id;

        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        const user = await this.userService.findOne(parseInt(id));
        if(!user) throw new NotFoundException('user not found');

        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.userService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(parseInt(id), body);
    }
}
