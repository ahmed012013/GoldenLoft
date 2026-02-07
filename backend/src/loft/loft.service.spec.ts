import { Test, TestingModule } from '@nestjs/testing';
import { LoftService } from './loft.service';
import { LoftRepository } from './loft.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('LoftService', () => {
  let service: LoftService;
  let loftRepository: LoftRepository;

  const mockLoftRepository = {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoftService,
        {
          provide: LoftRepository,
          useValue: mockLoftRepository,
        },
      ],
    }).compile();

    service = module.get<LoftService>(LoftService);
    loftRepository = module.get<LoftRepository>(LoftRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a loft successfully', async () => {
      const createLoftDto = {
        name: 'Test Loft',
        location: 'Cairo, Egypt',
      };

      const mockLoft = { id: 'loft-1', ...createLoftDto, userId: 'user-1' };

      jest.spyOn(loftRepository, 'create').mockResolvedValue(mockLoft);

      const result = await service.create('user-1', createLoftDto);

      expect(result).toEqual(mockLoft);
      expect(loftRepository.create).toHaveBeenCalledWith({
        ...createLoftDto,
        userId: 'user-1',
      });
    });
  });

  describe('findManyByUserId', () => {
    it('should return lofts for a user', async () => {
      const mockLofts = [
        { id: 'loft-1', name: 'Loft 1', _count: { birds: 10 } },
        { id: 'loft-2', name: 'Loft 2', _count: { birds: 5 } },
      ];

      jest.spyOn(loftRepository, 'findAll').mockResolvedValue(mockLofts);

      const result = await service.findManyByUserId('user-1');

      expect(result).toEqual(mockLofts);
      expect(loftRepository.findAll).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
    });
  });

  describe('update', () => {
    it('should update a loft successfully', async () => {
      const updateLoftDto = { name: 'Updated Loft' };
      const mockLoft = {
        id: 'loft-1',
        name: 'Original Loft',
        userId: 'user-1',
      };

      jest.spyOn(loftRepository, 'findUnique').mockResolvedValue(mockLoft);
      jest.spyOn(loftRepository, 'update').mockResolvedValue({
        ...mockLoft,
        ...updateLoftDto,
      });

      const result = await service.update('loft-1', 'user-1', updateLoftDto);

      expect(result.name).toBe('Updated Loft');
    });

    it('should throw NotFoundException if loft not found', async () => {
      jest.spyOn(loftRepository, 'findUnique').mockResolvedValue(null);

      await expect(
        service.update('loft-1', 'user-1', { name: 'Updated Loft' })
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own loft', async () => {
      const mockLoft = {
        id: 'loft-1',
        name: 'Test Loft',
        userId: 'user-2',
      };

      jest.spyOn(loftRepository, 'findUnique').mockResolvedValue(mockLoft);

      await expect(
        service.update('loft-1', 'user-1', { name: 'Updated Loft' })
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete a loft successfully', async () => {
      const mockLoft = {
        id: 'loft-1',
        name: 'Test Loft',
        userId: 'user-1',
      };

      jest.spyOn(loftRepository, 'findUnique').mockResolvedValue(mockLoft);
      jest.spyOn(loftRepository, 'remove').mockResolvedValue(mockLoft);

      const result = await service.remove('loft-1', 'user-1');

      expect(result).toEqual(mockLoft);
      expect(loftRepository.remove).toHaveBeenCalledWith('loft-1');
    });

    it('should throw NotFoundException if loft not found', async () => {
      jest.spyOn(loftRepository, 'findUnique').mockResolvedValue(null);

      await expect(service.remove('loft-1', 'user-1')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ForbiddenException if user does not own loft', async () => {
      const mockLoft = {
        id: 'loft-1',
        name: 'Test Loft',
        userId: 'user-2',
      };

      jest.spyOn(loftRepository, 'findUnique').mockResolvedValue(mockLoft);

      await expect(service.remove('loft-1', 'user-1')).rejects.toThrow(
        ForbiddenException
      );
    });
  });
});
