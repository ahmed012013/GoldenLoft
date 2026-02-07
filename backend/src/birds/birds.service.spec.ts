import { Test, TestingModule } from '@nestjs/testing';
import { BirdsService } from './birds.service';
import { BirdsRepository } from './birds.repository';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../common/services/cache.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BirdsService', () => {
  let service: BirdsService;
  let birdsRepository: BirdsRepository;
  let cacheService: CacheService;

  const mockPrismaService = {
    bird: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    loft: {
      findUnique: jest.fn(),
    },
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    invalidate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BirdsService,
        {
          provide: BirdsRepository,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
            findLoft: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<BirdsService>(BirdsService);
    birdsRepository = module.get<BirdsRepository>(BirdsRepository);
    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a bird successfully', async () => {
      const createBirdDto = {
        ringNumber: 'EG-2024-001',
        name: 'Test Bird',
        loftId: 'loft-1',
        gender: 'MALE',
        status: 'HEALTHY',
      };

      const mockLoft = { id: 'loft-1', userId: 'user-1' };
      const mockBird = { id: 'bird-1', ...createBirdDto };

      jest.spyOn(birdsRepository, 'findLoft').mockResolvedValue(mockLoft);
      jest.spyOn(birdsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(birdsRepository, 'create').mockResolvedValue(mockBird);
      jest.spyOn(cacheService, 'invalidate').mockResolvedValue(undefined);

      const result = await service.create('user-1', createBirdDto);

      expect(result).toEqual(mockBird);
      expect(birdsRepository.create).toHaveBeenCalled();
      expect(cacheService.invalidate).toHaveBeenCalledWith('birds:user-1:*');
    });

    it('should throw NotFoundException if loft not found', async () => {
      const createBirdDto = {
        ringNumber: 'EG-2024-001',
        name: 'Test Bird',
        loftId: 'loft-1',
      };

      jest.spyOn(birdsRepository, 'findLoft').mockResolvedValue(null);

      await expect(service.create('user-1', createBirdDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw BadRequestException if user does not own loft', async () => {
      const createBirdDto = {
        ringNumber: 'EG-2024-001',
        name: 'Test Bird',
        loftId: 'loft-1',
      };

      const mockLoft = { id: 'loft-1', userId: 'user-2' };
      jest.spyOn(birdsRepository, 'findLoft').mockResolvedValue(mockLoft);

      await expect(service.create('user-1', createBirdDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException if ring number already exists', async () => {
      const createBirdDto = {
        ringNumber: 'EG-2024-001',
        name: 'Test Bird',
        loftId: 'loft-1',
      };

      const mockLoft = { id: 'loft-1', userId: 'user-1' };
      const mockExistingBird = { id: 'bird-1', ringNumber: 'EG-2024-001' };

      jest.spyOn(birdsRepository, 'findLoft').mockResolvedValue(mockLoft);
      jest
        .spyOn(birdsRepository, 'findOne')
        .mockResolvedValue(mockExistingBird);

      await expect(service.create('user-1', createBirdDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('findAll', () => {
    it('should return cached data if available', async () => {
      const query = { skip: 0, take: 10 };
      const cachedData = [{ id: 'bird-1', name: 'Test Bird' }];

      jest.spyOn(cacheService, 'get').mockResolvedValue(cachedData);

      const result = await service.findAll('user-1', query);

      expect(result).toEqual(cachedData);
      expect(cacheService.get).toHaveBeenCalled();
    });

    it('should fetch from repository if not cached', async () => {
      const query = { skip: 0, take: 10 };
      const mockBirds = [{ id: 'bird-1', name: 'Test Bird' }];

      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(birdsRepository, 'findAll').mockResolvedValue(mockBirds);
      jest.spyOn(cacheService, 'set').mockResolvedValue(undefined);

      const result = await service.findAll('user-1', query);

      expect(result).toEqual(mockBirds);
      expect(birdsRepository.findAll).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a bird by id', async () => {
      const mockBird = {
        id: 'bird-1',
        name: 'Test Bird',
        loft: { userId: 'user-1' },
      };

      jest.spyOn(birdsRepository, 'findOne').mockResolvedValue(mockBird);

      const result = await service.findOne('user-1', 'bird-1');

      expect(result).toEqual(mockBird);
    });

    it('should throw NotFoundException if bird not found', async () => {
      jest.spyOn(birdsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('user-1', 'bird-1')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw NotFoundException if user does not own bird', async () => {
      const mockBird = {
        id: 'bird-1',
        name: 'Test Bird',
        loft: { userId: 'user-2' },
      };

      jest.spyOn(birdsRepository, 'findOne').mockResolvedValue(mockBird);

      await expect(service.findOne('user-1', 'bird-1')).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
