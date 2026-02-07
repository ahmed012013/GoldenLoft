import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    const url = configService.get<string>('DATABASE_URL');
    super({
      datasources: {
        db: {
          url: url,
        },
      },
      log: ['info', 'warn', 'error'],
    });
    this.logger.log(
      `PrismaService initialized with DB URL: ${url ? url.replace(/:[^:]+@/, ':***@') : 'undefined'}`
    );
  }

  async onModuleInit() {
    this.logger.log('Connecting to database...');
    try {
      await this.$connect();
      this.logger.log('Successfully connected to database.');
    } catch (e) {
      this.logger.error('Failed to connect to database', e);
      throw e;
    }
  }
}
