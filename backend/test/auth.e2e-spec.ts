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
    it('should register a new user and set cookie', async () => {
      const response = await request
        .default(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'Password123!',
          name: 'New User',
        })
        .expect(201);

      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('access_token=');
      expect(response.body).toHaveProperty('access_token');
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
        .expect(409); // ConflictException is 409
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials and set cookie', async () => {
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

      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('access_token=');
      expect(response.body).toHaveProperty('access_token');
    });
  });

  describe('/auth/profile (GET)', () => {
    it('should get profile using cookie', async () => {
      const loginRes = await request
        .default(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'profile@example.com',
          password: 'Password123!',
          name: 'Profile User',
        });

      const cookie = loginRes.headers['set-cookie'];

      const response = await request
        .default(app.getHttpServer())
        .get('/auth/profile')
        .set('Cookie', cookie)
        .expect(200);

      expect(response.body.email).toBe('profile@example.com');
    });

    it('should fail without cookie or token', async () => {
      await request
        .default(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });
  });

  describe('/auth/logout (POST)', () => {
    it('should clear cookie on logout', async () => {
      const response = await request
        .default(app.getHttpServer())
        .post('/auth/logout')
        .expect(201);

      expect(response.headers['set-cookie'][0]).toContain('access_token=;');
    });
  });
});
