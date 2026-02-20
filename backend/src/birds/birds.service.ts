import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BirdsRepository } from './birds.repository';
import { CreateBirdDto } from '@shared/dtos/create-bird.dto';
import { GetBirdsDto } from '@shared/dtos/get-birds.dto';
import { BirdGender, BirdStatus, BirdType } from '@shared/enums/bird.enums';
import { Prisma } from '@prisma/client';
import { UpdateBirdDto } from '@shared/dtos/update-bird.dto';

@Injectable()
export class BirdsService {
  constructor(private birdsRepository: BirdsRepository) {}

  async create(
    userId: string,
    createBirdDto: CreateBirdDto & { image?: string }
  ) {
    // Verify Loft Ownership
    const loft = await this.birdsRepository.findLoft(createBirdDto.loftId);
    if (!loft) throw new NotFoundException('Loft not found');
    if (loft.userId !== userId) {
      throw new BadRequestException('You do not own this loft');
    }

    // Pedigree Safety
    if (
      createBirdDto.fatherId &&
      createBirdDto.motherId &&
      createBirdDto.fatherId === createBirdDto.motherId
    ) {
      throw new BadRequestException(
        'Father and Mother cannot be the same bird'
      );
    }

    // Check for duplicate ringNumber
    const existingBird = await this.birdsRepository.findOne({
      ringNumber: createBirdDto.ringNumber,
    });

    if (existingBird) {
      throw new BadRequestException(
        'Bird with this ring number already exists'
      );
    }

    return this.birdsRepository.create({
      ringNumber: createBirdDto.ringNumber,
      name: createBirdDto.name,
      gender: createBirdDto.gender || BirdGender.UNKNOWN,
      color: createBirdDto.color || 'unknown',
      status: createBirdDto.status || BirdStatus.HEALTHY,
      type: createBirdDto.type || BirdType.UNKNOWN,
      ...(createBirdDto.birthDate && {
        birthDate: new Date(createBirdDto.birthDate),
      }),
      loft: { connect: { id: createBirdDto.loftId } },
      father: createBirdDto.fatherId
        ? { connect: { id: createBirdDto.fatherId } }
        : undefined,
      mother: createBirdDto.motherId
        ? { connect: { id: createBirdDto.motherId } }
        : undefined,
      totalRaces: createBirdDto.totalRaces,
      wins: createBirdDto.wins,
      weight: createBirdDto.weight,
      notes: createBirdDto.notes,
      image: createBirdDto.image,
    });
  }

  async findAll(userId: string, query?: GetBirdsDto) {
    const { gender, status, search, skip, take } = query || {};

    return this.birdsRepository.findAll({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      where: {
        loft: { userId }, // Enforce User Check
        gender: gender ? { equals: gender } : undefined,
        status: status ? { equals: status } : undefined,
        OR: search
          ? [
              { ringNumber: { contains: search } },
              { name: { contains: search } },
            ]
          : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, id: string) {
    const bird = await this.birdsRepository.findOne({ id });

    if (!bird) {
      throw new NotFoundException(`Bird with ID ${id} not found`);
    }

    if (bird.loft.userId !== userId) {
      throw new NotFoundException(`Bird with ID ${id} not found`); // Hiding existence
    }

    return bird;
  }

  async getStats(userId: string) {
    const baseWhere = { loft: { userId } };

    const total = await this.birdsRepository.count({ ...baseWhere });
    const healthy = await this.birdsRepository.count({
      ...baseWhere,
      status: BirdStatus.HEALTHY,
    });
    const sick = await this.birdsRepository.count({
      ...baseWhere,
      status: BirdStatus.SICK,
    });
    const males = await this.birdsRepository.count({
      ...baseWhere,
      gender: BirdGender.MALE,
    });
    const females = await this.birdsRepository.count({
      ...baseWhere,
      gender: BirdGender.FEMALE,
    });

    const statusDistribution =
      await this.birdsRepository.getStatusDistribution(userId);

    // Map the groupBy result to a cleaner object if needed, or return as is
    // Result format: [{ status: 'healthy', _count: { status: 10 } }, ...]
    const statusBreakdown = statusDistribution.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));

    return { total, healthy, sick, males, females, statusBreakdown };
  }

  async getPedigree(userId: string, id: string) {
    const bird = await this.birdsRepository.findOne({ id });
    if (!bird || bird.loft.userId !== userId) {
      throw new NotFoundException(`Bird with ID ${id} not found`);
    }
    return bird;
  }

  async findByRingNumber(userId: string, ringNumber: string) {
    const bird = await this.birdsRepository.findOne({ ringNumber });
    if (!bird) {
      throw new NotFoundException(
        `Bird with ring number ${ringNumber} not found`
      );
    }
    if (bird.loft.userId !== userId) {
      throw new NotFoundException(
        `Bird with ring number ${ringNumber} not found`
      );
    }
    return bird;
  }
  async update(
    userId: string,
    id: string,
    updateBirdDto: UpdateBirdDto & { image?: string }
  ) {
    // Check ownership
    const bird = await this.birdsRepository.findOne({ id });
    if (!bird || bird.loft.userId !== userId) {
      throw new NotFoundException(`Bird with ID ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fatherId, motherId, loftId, birthDate, ...rest } = updateBirdDto;

    const updateData: Prisma.BirdUpdateInput = {
      ...rest,
      ...(fatherId && { father: { connect: { id: fatherId } } }),
      ...(motherId && { mother: { connect: { id: motherId } } }),
      ...(birthDate && { birthDate: new Date(birthDate) }),
    };

    return this.birdsRepository.update(id, updateData);
  }

  async remove(userId: string, id: string) {
    const bird = await this.birdsRepository.findOne({ id });
    if (!bird || bird.loft.userId !== userId) {
      throw new NotFoundException(`Bird with ID ${id} not found`);
    }
    return this.birdsRepository.remove(id);
  }
}
