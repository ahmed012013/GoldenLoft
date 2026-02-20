import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEggDto } from './dto/create-egg.dto';
import { UpdateEggDto } from './dto/update-egg.dto';
import { EggStatus } from '@prisma/client';

@Injectable()
export class EggsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateEggDto) {
    // Verify Pairing Ownership
    const pairing = await this.prisma.pairing.findUnique({
      where: { id: dto.pairingId },
    });

    if (!pairing) throw new NotFoundException('Pairing not found');
    if (pairing.userId !== userId) {
      throw new BadRequestException('You do not own this pairing');
    }

    // Auto-calculate Hatch Date (18 days after Lay Date)
    const layDate = new Date(dto.layDate);
    const hatchDateExpected = new Date(layDate);
    hatchDateExpected.setDate(layDate.getDate() + 18);

    return this.prisma.egg.create({
      data: {
        pairingId: dto.pairingId,
        layDate: layDate,
        hatchDateExpected: hatchDateExpected,
        status: dto.status || EggStatus.LAID,
        ...(dto.candlingDate && { candlingDate: new Date(dto.candlingDate) }),
        ...(dto.candlingResult && { candlingResult: dto.candlingResult }),
      },
      include: {
        pairing: { include: { male: true, female: true } },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.egg.findMany({
      where: { pairing: { userId } },
      include: {
        pairing: { include: { male: true, female: true } },
      },
      orderBy: { layDate: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const _egg = await this.prisma.egg.findUnique({
      where: { id },
      include: {
        pairing: { include: { male: true, female: true } },
      },
    });

    if (!_egg || _egg.pairing.userId !== userId) {
      throw new NotFoundException('Egg not found');
    }
    return _egg;
  }

  async update(userId: string, id: string, dto: UpdateEggDto) {
    await this.findOne(userId, id); // Ownership check

    return this.prisma.egg.update({
      where: { id },
      data: {
        ...(dto.hatchDateActual && {
          hatchDateActual: new Date(dto.hatchDateActual),
        }),
        ...(dto.status && { status: dto.status }),
        ...(dto.candlingDate !== undefined && {
          candlingDate: dto.candlingDate ? new Date(dto.candlingDate) : null,
        }),
        ...(dto.candlingResult !== undefined && {
          candlingResult: dto.candlingResult,
        }),
      },
      include: {
        pairing: { include: { male: true, female: true } },
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.egg.delete({ where: { id } });
  }

  async hatch(userId: string, id: string) {
    const egg = await this.findOne(userId, id);

    if (egg.status === EggStatus.HATCHED) {
      throw new BadRequestException(
        'Egg is already hatched (البيضة فاقسة بالفعل)'
      );
    }

    // 1. Update Egg Status
    const updatedEgg = await this.prisma.egg.update({
      where: { id },
      data: {
        status: EggStatus.HATCHED,
        hatchDateActual: new Date(),
      },
    });

    // 2. Create Squab
    // Get parent info
    const pairing = egg.pairing;
    const male = pairing.male;

    // Generate temporary ring number and name
    const timestamp = Date.now().toString().slice(-6);
    const ringNumber = `SQ-${timestamp}`;
    const name = `Squab ${timestamp}`;

    // Create the bird
    await this.prisma.bird.create({
      data: {
        ringNumber,
        name,
        gender: 'unknown', // BirdGender.UNKNOWN
        status: 'squab', // BirdStatus.SQUAB
        type: 'unknown', // BirdType.UNKNOWN
        birthDate: new Date(),
        loftId: male.loftId, // Inherit usage of male's loft
        fatherId: pairing.maleId,
        motherId: pairing.femaleId,
        color: 'unknown',
        image:
          'https://res.cloudinary.com/dcyr5qih0/image/upload/v1740051397/hatchling_placeholder_k2b7km.png', // Optional placeholder
      },
    });

    return updatedEgg;
  }
}
