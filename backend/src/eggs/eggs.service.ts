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
import * as crypto from 'crypto';

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

    return this.prisma.$transaction(async (tx) => {
      const egg = await tx.egg.create({
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

      if (egg.status === EggStatus.HATCHED) {
        await this.createSquab(egg, tx);
      }

      return egg;
    });
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

    return this.prisma.$transaction(async (tx) => {
      const updatedEgg = await tx.egg.update({
        where: { id },
        data: {
          status: dto.status,
          hatchDateActual:
            dto.status === EggStatus.HATCHED
              ? dto.hatchDateActual
                ? new Date(dto.hatchDateActual)
                : dto.hatchDate
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

      if (
        dto.status === EggStatus.HATCHED &&
        egg.status !== EggStatus.HATCHED
      ) {
        await this.createSquab(updatedEgg, tx);
      }

      return updatedEgg;
    });
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

    return this.prisma.$transaction(async (tx) => {
      const updatedEgg = await tx.egg.update({
        where: { id },
        data: {
          status: EggStatus.HATCHED,
          hatchDateActual: hatchDate,
        },
        include: {
          pairing: { include: { male: true, female: true } },
        },
      });

      await this.createSquab(updatedEgg, tx);

      return updatedEgg;
    });
  }

  private async createSquab(
    egg: EggWithParents,
    tx: Prisma.TransactionClient = this.prisma
  ): Promise<Bird> {
    const hatchDate: Date = egg.hatchDateActual || new Date();
    const pairing = egg.pairing;
    const male = pairing.male;

    // Generate truly unique ring number using UUID
    const uniqueId = crypto.randomUUID().slice(0, 8).toUpperCase();
    const ringNumber = `SQ-${uniqueId}`;
    const name = `Squab ${uniqueId}`;

    return tx.bird.create({
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
        image: null,
      },
    });
  }
}
