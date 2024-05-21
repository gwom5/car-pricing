import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from "./auth.service";
import {User} from "./user.entity";
import {BadRequestException, NotFoundException} from "@nestjs/common";


describe('Auth Service', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;
    beforeEach(async () => {
        const users: User[] = [];
        fakeUsersService = {
            find: (email) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user: User = { email, password, id: Math.floor(Math.random() * 9999999) } as User;
                users.push(user);
                return Promise.resolve(user);
            },
        }

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                }
            ],
        }).compile();

        service = module.get(AuthService);
    });

    it('Can create an instance of Auth Service', async () => {
        expect(module).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signUp('test@test.com', '12345');
        expect(user.password).not.toEqual('12345');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws error if user signs up with email that is in use', async () => {
        await service.signUp('test@test.com', '12345');
        await expect(service.signUp('test@test.com', '12345')).rejects.toThrow(BadRequestException);
    });

    it('throws error if sign in is called with an unused email', async () => {
        await expect(service.signIn('test@test.com', '12345')).rejects.toThrow(NotFoundException);
    });

    it('throws error if an invalid password is provided', async () => {
        await service.signUp('test@test.com', '12345');
        await expect(service.signIn('test@test.com', 'whatever')).rejects.toThrow(BadRequestException);
    });

    it('returns a user if correct password is provided', async () => {
        await service.signUp('test@test.com', '12345');
        const user = await service.signIn('test@test.com', '12345');
        expect(user).toBeDefined();
    });
});