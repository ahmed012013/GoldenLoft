import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { BirdGender, BirdStatus, BirdType } from '@shared/enums/bird.enums';

describe('BirdsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtToken: string;
  let userId: string;
  let loftId: string;

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
    // Cleanup database
    await prisma.bird.deleteMany();
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

    userId = userResponse.body.user.id;
    // Login to get token
    const loginResponse = await request
      .default(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
      })
      .expect(201);

    jwtToken = loginResponse.body.token;

    // Create Loft
    const loftResponse = await request
      .default(app.getHttpServer())
      .post('/lofts')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        name: 'Test Loft',
        capacity: 50,
      })
      .expect(201);

    loftId = loftResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/birds (POST)', () => {
    it('should create a bird', async () => {
      const createBirdDto = {
        ringNumber: 'EGY-2024-100',
        name: 'Champion',
        loftId: loftId,
        gender: BirdGender.MALE,
        status: BirdStatus.HEALTHY,
        type: BirdType.RACING,
        color: 'Blue Bar', // Added required field
      };

      const response = await request
        .default(app.getHttpServer())
        .post('/birds')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(createBirdDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.ringNumber).toBe(createBirdDto.ringNumber);
    });

    it('should fail if ring number is duplicate', async () => {
      const createBirdDto = {
        ringNumber: 'EGY-2024-100',
        name: 'Champion',
        loftId: loftId,
        gender: BirdGender.MALE,
        status: BirdStatus.HEALTHY,
        type: BirdType.RACING,
        color: 'Blue Bar',
      };

      // Create first time
      await request
        .default(app.getHttpServer())
        .post('/birds')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(createBirdDto)
        .expect(201);

      // Create second time
      await request
        .default(app.getHttpServer())
        .post('/birds')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(createBirdDto)
        .expect(400); // Should return BadRequest
    });
  });

  describe('/birds (GET)', () => {
    it('should return all birds for the user', async () => {
      // Create some birds
      await prisma.bird.create({
        data: {
          ringNumber: 'BIRD-1',
          name: 'Bird 1',
          gender: BirdGender.MALE,
          status: BirdStatus.HEALTHY,
          type: BirdType.RACING,
          color: 'Chequered',
          loft: { connect: { id: loftId } },
        },
      });

      const response = await request
        .default(app.getHttpServer())
        .get('/birds')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].ringNumber).toBe('BIRD-1');
    });
  });

  describe('/birds/:id (PATCH)', () => {
    it('should update a bird', async () => {
      // Create a bird first
      const bird = await prisma.bird.create({
        data: {
          ringNumber: 'UPDATE-TEST',
          name: 'Original Name',
          gender: BirdGender.MALE,
          status: BirdStatus.HEALTHY,
          type: BirdType.RACING,
          color: 'Red',
          loftId: loftId,
        },
      });

      const response = await request
        .default(app.getHttpServer())
        .patch(`/birds/${bird.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          name: 'Updated Name',
          status: BirdStatus.SOLD,
        })
        .expect(200);

      expect(response.body.name).toBe('Updated Name');
      expect(response.body.status).toBe(BirdStatus.SOLD);
    });
  });

  describe('/birds/:id (DELETE)', () => {
    it('should delete a bird', async () => {
      const bird = await prisma.bird.create({
        data: {
          ringNumber: 'DELETE-TEST',
          name: 'To Delete',
          gender: BirdGender.FEMALE,
          status: BirdStatus.HEALTHY,
          type: BirdType.RACING,
          color: 'White',
          loftId: loftId,
        },
      });

      await request
        .default(app.getHttpServer())
        .delete(`/birds/${bird.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      const check = await prisma.bird.findUnique({ where: { id: bird.id } });
      expect(check).toBeNull();
    });
  });

  describe('Access Control', () => {
    it('should NOT allow accessing another users bird', async () => {
      // Create another user and loft
      const otherUser = await prisma.user.create({
        data: {
          email: 'other@example.com',
          password: 'Password123!',
          name: 'Other User',
        },
      });
      const otherLoft = await prisma.loft.create({
        data: {
          name: 'Other Loft',
          userId: otherUser.id,
        },
      });
      const otherBird = await prisma.bird.create({
        data: {
          ringNumber: 'OTHER-BIRD',
          name: 'Alien Bird',
          gender: BirdGender.MALE,
          status: BirdStatus.HEALTHY,
          type: BirdType.RACING,
          color: 'Black',
          loftId: otherLoft.id,
        },
      });

      // Try to get other bird with current user token
      await request
        .default(app.getHttpServer())
        .get(`/birds/${otherBird.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404); // Use 404 to hide existence
    });
  });
});
