import { Test, TestingModule } from '@nestjs/testing';
import { BirdsService } from './birds.service';
import { BirdsRepository } from './birds.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BirdGender, BirdStatus, BirdType } from '@shared/enums/bird.enums';

describe('BirdsService', () => {
  let service: BirdsService;
  let repository: BirdsRepository;

  const mockBirdsRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    findLoft: jest.fn(),
    count: jest.fn(),
    getStatusDistribution: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BirdsService,
        {
          provide: BirdsRepository,
          useValue: mockBirdsRepository,
        },
      ],
    }).compile();

    service = module.get<BirdsService>(BirdsService);
    repository = module.get<BirdsRepository>(BirdsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const userId = 'user-1';
    const createBirdDto = {
      ringNumber: 'EGY-2024-100',
      name: 'Champion',
      loftId: 'loft-1',
      gender: BirdGender.MALE,
      color: 'Blue Bar',
      status: BirdStatus.HEALTHY,
      type: BirdType.RACING,
    };

    it('should create a bird successfully', async () => {
      mockBirdsRepository.findLoft.mockResolvedValue({ id: 'loft-1', userId });
      mockBirdsRepository.findOne.mockResolvedValue(null); // No existing bird
      mockBirdsRepository.create.mockResolvedValue({
        id: 'bird-1',
        ...createBirdDto,
      });

      const result = await service.create(userId, createBirdDto);

      expect(result).toEqual({ id: 'bird-1', ...createBirdDto });
      expect(repository.findLoft).toHaveBeenCalledWith('loft-1');
      expect(repository.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user does not own loft', async () => {
      mockBirdsRepository.findLoft.mockResolvedValue({
        id: 'loft-1',
        userId: 'other-user',
      });

      await expect(service.create(userId, createBirdDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException if bird with ring number exists', async () => {
      mockBirdsRepository.findLoft.mockResolvedValue({ id: 'loft-1', userId });
      mockBirdsRepository.findOne.mockResolvedValue({ id: 'existing-bird' });

      await expect(service.create(userId, createBirdDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of birds', async () => {
      const userId = 'user-1';
      const birds = [{ id: 'bird-1', name: 'Bird 1' }];
      mockBirdsRepository.findAll.mockResolvedValue(birds);

      const result = await service.findAll(userId);

      expect(result).toEqual(birds);
      expect(repository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ loft: { userId } }),
        })
      );
    });
  });

  describe('findOne', () => {
    const userId = 'user-1';
    const birdId = 'bird-1';

    it('should return a bird if found and owned by user', async () => {
      const bird = { id: birdId, loft: { userId } };
      mockBirdsRepository.findOne.mockResolvedValue(bird);

      const result = await service.findOne(userId, birdId);

      expect(result).toEqual(bird);
    });

    it('should throw NotFoundException if bird not found', async () => {
      mockBirdsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(userId, birdId)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw NotFoundException if bird belongs to another user', async () => {
      const bird = { id: birdId, loft: { userId: 'other-user' } };
      mockBirdsRepository.findOne.mockResolvedValue(bird);

      await expect(service.findOne(userId, birdId)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
