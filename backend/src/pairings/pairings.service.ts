import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePairingDto } from './dto/create-pairing.dto';
import { UpdatePairingDto } from './dto/update-pairing.dto';
import { PairingStatus } from '@prisma/client';
import { BirdGender } from '@shared/enums/bird.enums';

@Injectable()
export class PairingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePairingDto) {
    if (dto.maleId === dto.femaleId) {
      throw new BadRequestException('Cannot pair a bird with itself');
    }
    // 1. Verify Male
    const male = await this.prisma.bird.findUnique({
      where: { id: dto.maleId },
      include: { loft: true },
    });
    if (!male) throw new NotFoundException('Male bird not found');
    if (male.loft.userId !== userId) {
      throw new BadRequestException('You do not own the male bird');
    }
    if (male.gender !== (BirdGender.MALE as string)) {
      throw new BadRequestException('Selected male bird is not a male');
    }

    // 2. Verify Female
    const female = await this.prisma.bird.findUnique({
      where: { id: dto.femaleId },
      include: { loft: true },
    });
    if (!female) throw new NotFoundException('Female bird not found');
    if (female.loft.userId !== userId) {
      throw new BadRequestException('You do not own the female bird');
    }
    if (female.gender !== (BirdGender.FEMALE as string)) {
      throw new BadRequestException('Selected female bird is not a female');
    }

    // 3. Create Pairing
    return this.prisma.pairing.create({
      data: {
        maleId: dto.maleId,
        femaleId: dto.femaleId,
        startDate: new Date(dto.startDate),
        userId: userId,
        status: PairingStatus.ACTIVE,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.pairing.findMany({
      where: { userId },
      include: {
        male: true,
        female: true,
        eggs: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const pairing = await this.prisma.pairing.findUnique({
      where: { id },
      include: {
        male: true,
        female: true,
        eggs: true,
      },
    });

    if (!pairing || pairing.userId !== userId) {
      throw new NotFoundException('Pairing not found');
    }
    return pairing;
  }

  async update(userId: string, id: string, dto: UpdatePairingDto) {
    await this.findOne(userId, id); // Checks ownership

    return this.prisma.pairing.update({
      where: { id },
      data: {
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        ...(dto.status && { status: dto.status }),
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id); // Checks ownership
    return this.prisma.pairing.delete({ where: { id } });
  }

  async getStats(userId: string) {
    const activePairings = await this.prisma.pairing.count({
      where: { userId, status: PairingStatus.ACTIVE },
    });

    // Calculate eggs hatching in next 7 days
    // We need to fetch eggs where hatchDateExpected is between NOW and NOW+7 days
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const eggsHatchingSoon = await this.prisma.egg.count({
      where: {
        pairing: { userId },
        hatchDateExpected: {
          gte: today,
          lte: nextWeek,
        },
        status: 'LAID',
      },
    });

    return { activePairings, eggsHatchingSoon };
  }
}
