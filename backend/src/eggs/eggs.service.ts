import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEggDto } from './dto/create-egg.dto';
import { UpdateEggDto } from './dto/update-egg.dto';
import { HatchEggDto } from './dto/hatch-egg.dto';
import { EggStatus, Bird, Prisma } from '@prisma/client';

type EggWithParents = Prisma.EggGetPayload<{
  include: { pairing: { include: { male: true; female: true } } };
}>;

@Injectable()
export class EggsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateEggDto) {
    // Verify Pairing Ownership
    const pairing = await this.prisma.pairing.findUnique({
      where: { id: dto.pairingId },
      include: { male: true },
    });

    if (!pairing) throw new NotFoundException('Pairing not found');
    if (pairing.userId !== userId) {
      throw new BadRequestException('You do not own this pairing');
    }

    // Auto-calculate Hatch Date (18 days after Lay Date)
    const layDate = new Date(dto.layDate);
    const hatchDateExpected = new Date(layDate);
    hatchDateExpected.setDate(layDate.getDate() + 18);

    const egg = await this.prisma.egg.create({
      data: {
        pairingId: dto.pairingId,
        layDate: layDate,
        hatchDateExpected: hatchDateExpected,
        hatchDateActual:
          dto.status === EggStatus.HATCHED && dto.hatchDate
            ? new Date(dto.hatchDate)
            : dto.status === EggStatus.HATCHED
              ? new Date()
              : null,
        status: dto.status || EggStatus.LAID,
        ...(dto.candlingDate && { candlingDate: new Date(dto.candlingDate) }),
        ...(dto.candlingResult && { candlingResult: dto.candlingResult }),
      },
      include: {
        pairing: { include: { male: true, female: true } },
      },
    });

    // If created as hatched, create the squab
    if (egg.status === EggStatus.HATCHED) {
      await this.createSquab(egg);
    }

    return egg;
  }

  async findAll(userId: string) {
    return this.prisma.egg.findMany({
      where: {
        pairing: {
          userId: userId,
        },
      },
      include: {
        pairing: {
          include: {
            male: true,
            female: true,
          },
        },
      },
      orderBy: { layDate: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const egg = await this.prisma.egg.findUnique({
      where: { id },
      include: {
        pairing: {
          include: {
            male: true,
            female: true,
          },
        },
      },
    });

    if (!egg) throw new NotFoundException('Egg not found');
    if (egg.pairing.userId !== userId) {
      throw new BadRequestException('You do not own this egg');
    }

    return egg;
  }

  async update(userId: string, id: string, dto: UpdateEggDto) {
    const egg = await this.findOne(userId, id);

    const updatedEgg = await this.prisma.egg.update({
      where: { id },
      data: {
        status: dto.status,
        hatchDateActual:
          dto.status === EggStatus.HATCHED
            ? dto.hatchDate
              ? new Date(dto.hatchDate)
              : egg.hatchDateActual || new Date()
            : dto.status
              ? null
              : undefined,
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

    // If status changed to HATCHED, create squab if it doesn't exist (simplification: always create)
    if (dto.status === EggStatus.HATCHED && egg.status !== EggStatus.HATCHED) {
      await this.createSquab(updatedEgg);
    }

    return updatedEgg;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.egg.delete({ where: { id } });
  }

  async hatch(userId: string, id: string, dto: HatchEggDto) {
    const egg = await this.findOne(userId, id);

    if (egg.status === EggStatus.HATCHED) {
      throw new BadRequestException(
        'Egg is already hatched (البيضة فاقسة بالفعل)'
      );
    }

    const hatchDate = dto.hatchDate ? new Date(dto.hatchDate) : new Date();

    // 1. Update Egg Status
    const updatedEgg = await this.prisma.egg.update({
      where: { id },
      data: {
        status: EggStatus.HATCHED,
        hatchDateActual: hatchDate,
      },
      include: {
        pairing: { include: { male: true, female: true } },
      },
    });

    // 2. Create Squab
    await this.createSquab(updatedEgg);

    return updatedEgg;
  }

  private async createSquab(egg: EggWithParents): Promise<Bird> {
    const hatchDate: Date = egg.hatchDateActual || new Date();
    const pairing = egg.pairing;
    const male = pairing.male;

    // Generate temporary ring number and name
    const timestamp = Date.now().toString().slice(-6);
    const ringNumber = `SQ-${timestamp}`;
    const name = `Squab ${timestamp}`;

    return this.prisma.bird.create({
      data: {
        ringNumber,
        name,
        gender: 'unknown',
        status: 'squab',
        type: 'unknown',
        birthDate: hatchDate,
        loftId: male.loftId,
        fatherId: pairing.maleId,
        motherId: pairing.femaleId,
        color: 'unknown',
        image:
          'https://res.cloudinary.com/dcyr5qih0/image/upload/v1740051397/hatchling_placeholder_k2b7km.png',
      },
    });
  }
}
