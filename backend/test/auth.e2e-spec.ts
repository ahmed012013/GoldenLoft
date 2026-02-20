import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', async () => {
      const response = await request
        .default(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'Password123!',
          name: 'New User',
        })
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('newuser@example.com');
      expect(response.body).toHaveProperty('token');
    });

    it('should fail on duplicate email', async () => {
      await prisma.user.create({
        data: {
          email: 'duplicate@example.com',
          password: 'Password123!',
          name: 'Existing User',
        },
      });

      await request
        .default(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Password123!',
          name: 'New User',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials', async () => {
      await request.default(app.getHttpServer()).post('/auth/register').send({
        email: 'login@example.com',
        password: 'Password123!',
        name: 'Login User',
      });

      const response = await request
        .default(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: 'Password123!',
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
    });

    it('should fail with invalid password', async () => {
      await request.default(app.getHttpServer()).post('/auth/register').send({
        email: 'wrongpass@example.com',
        password: 'Password123!',
        name: 'User',
      });

      await request
        .default(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'wrongpass@example.com',
          password: 'WrongPassword',
        })
        .expect(401);
    });
  });
});
