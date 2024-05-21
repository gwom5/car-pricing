import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../src/app.module";

describe('Auth Controller (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('handles a sign up request', () => {
        const email = 'test@test.com';
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: '12345'})
            .expect(201)
            .then(res => {
                const { email, id } = res.body;
                expect(id).toBeDefined();
                expect(email).toEqual(email)
            });
    });

    it('signup as a new user then get the currently logged in user', async () => {
        const email = 'test1@test.com';
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: '12345'})
            .expect(201);

        const cookie = res.get('Set-Cookie');

        const { body } = await request(app.getHttpServer())
            .get('/auth/whoami')
            .set('Cookie', cookie)
            .expect(200);

        expect(body.email).toEqual(email);
    });
});
