import { Test, TestingModule } from '@nestjs/testing';
import { PairingsService } from './pairings.service';
import { PairingsRepository } from './pairings.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PairingsService', () => {
  let service: PairingsService;
  let pairingsRepository: PairingsRepository;

  const mockPairingsRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  const mockPrismaService = {
    bird: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PairingsService,
        {
          provide: PairingsRepository,
          useValue: mockPairingsRepository,
        },
        {
          provide: 'PrismaService',
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PairingsService>(PairingsService);
    pairingsRepository = module.get<PairingsRepository>(PairingsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a pairing successfully', async () => {
      const createPairingDto = {
        maleId: 'bird-1',
        femaleId: 'bird-2',
        startDate: '2024-01-01',
      };

      const mockMale = {
        id: 'bird-1',
        gender: 'MALE',
        loft: { userId: 'user-1' },
      };
      const mockFemale = {
        id: 'bird-2',
        gender: 'FEMALE',
        loft: { userId: 'user-1' },
      };
      const mockPairing = {
        id: 'pairing-1',
        ...createPairingDto,
        userId: 'user-1',
      };

      jest
        .spyOn(mockPrismaService.bird, 'findUnique')
        .mockResolvedValueOnce(mockMale)
        .mockResolvedValueOnce(mockFemale);
      jest.spyOn(pairingsRepository, 'create').mockResolvedValue(mockPairing);

      const result = await service.create('user-1', createPairingDto);

      expect(result).toEqual(mockPairing);
    });

    it('should throw BadRequestException if male and female are the same', async () => {
      const createPairingDto = {
        maleId: 'bird-1',
        femaleId: 'bird-1',
        startDate: '2024-01-01',
      };

      await expect(service.create('user-1', createPairingDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw NotFoundException if male bird not found', async () => {
      const createPairingDto = {
        maleId: 'bird-1',
        femaleId: 'bird-2',
        startDate: '2024-01-01',
      };

      jest.spyOn(mockPrismaService.bird, 'findUnique').mockResolvedValue(null);

      await expect(service.create('user-1', createPairingDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw BadRequestException if user does not own male bird', async () => {
      const createPairingDto = {
        maleId: 'bird-1',
        femaleId: 'bird-2',
        startDate: '2024-01-01',
      };

      const mockMale = {
        id: 'bird-1',
        gender: 'MALE',
        loft: { userId: 'user-2' },
      };

      jest
        .spyOn(mockPrismaService.bird, 'findUnique')
        .mockResolvedValue(mockMale);

      await expect(service.create('user-1', createPairingDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('findAll', () => {
    it('should return all pairings for a user', async () => {
      const mockPairings = [
        { id: 'pairing-1', userId: 'user-1' },
        { id: 'pairing-2', userId: 'user-1' },
      ];

      jest.spyOn(pairingsRepository, 'findAll').mockResolvedValue(mockPairings);

      const result = await service.findAll('user-1');

      expect(result).toEqual(mockPairings);
      expect(pairingsRepository.findAll).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: {
          male: true,
          female: true,
          eggs: true,
        },
        orderBy: { startDate: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a pairing by id', async () => {
      const mockPairing = {
        id: 'pairing-1',
        userId: 'user-1',
        male: {},
        female: {},
        eggs: [],
      };

      jest.spyOn(pairingsRepository, 'findOne').mockResolvedValue(mockPairing);

      const result = await service.findOne('user-1', 'pairing-1');

      expect(result).toEqual(mockPairing);
    });

    it('should throw NotFoundException if pairing not found', async () => {
      jest.spyOn(pairingsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('user-1', 'pairing-1')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw NotFoundException if user does not own pairing', async () => {
      const mockPairing = {
        id: 'pairing-1',
        userId: 'user-2',
        male: {},
        female: {},
        eggs: [],
      };

      jest.spyOn(pairingsRepository, 'findOne').mockResolvedValue(mockPairing);

      await expect(service.findOne('user-1', 'pairing-1')).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
