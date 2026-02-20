import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('LoftsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtToken: string;

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
    await prisma.loft.deleteMany();
    await prisma.user.deleteMany();

    // Setup Test User
    const userResponse = await request
      .default(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      })
      .expect(201);

    const loginResponse = await request
      .default(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
      })
      .expect(201);

    jwtToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/lofts (POST)', () => {
    it('should create a loft', async () => {
      const response = await request
        .default(app.getHttpServer())
        .post('/lofts')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          name: 'My Best Loft',
          capacity: 100,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('My Best Loft');
    });
  });

  describe('/lofts (GET)', () => {
    it('should get user lofts', async () => {
      await request
        .default(app.getHttpServer())
        .post('/lofts')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ name: 'Loft 1' });

      const response = await request
        .default(app.getHttpServer())
        .get('/lofts')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });
});
