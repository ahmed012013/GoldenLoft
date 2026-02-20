import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig, Pool } from '@neondatabase/serverless';

// Enable WebSocket for Node.js environment
let ws: any;
try {
  ws = require('ws');
  neonConfig.webSocketConstructor = ws;
} catch (e) {
  // ws not available, will use native WebSocket if available
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    const url = configService.get<string>('DATABASE_URL') || '';

    // Create Neon serverless pool (connects via WebSocket on port 443)
    const pool = new Pool({ connectionString: url });
    const adapter = new PrismaNeon(pool);

    super({
      adapter,
      log: ['info', 'warn', 'error'],
    } as any);

    this.logger.log(
      `PrismaService initialized with Neon Serverless Driver (WebSocket)`
    );
    this.logger.log(
      `DB URL: ${url ? url.replace(/:[^:]+@/, ':***@') : 'undefined'}`
    );
  }

  async onModuleInit() {
    this.logger.log(
      '🔌 Attempting database connection via WebSocket (port 443)...'
    );

    try {
      const startTime = Date.now();
      await this.$connect();
      const duration = Date.now() - startTime;

      this.logger.log(`✅ Successfully connected to database in ${duration}ms`);

      // Test query to verify connection
      await this.$queryRaw`SELECT 1 as test`;
      this.logger.log('✅ Database connection verified with test query');
      this.logger.log(
        '🌐 Connection established via WebSocket (bypasses port 5432 block)'
      );
    } catch (e) {
      this.logger.error('❌ Failed to connect to database');
      this.logger.error(`Error Code: ${(e as any).code || 'UNKNOWN'}`);
      this.logger.error(`Error Message: ${(e as any).message}`);

      if ((e as any).message?.includes('TLS')) {
        this.logger.error('🔴 TLS/SSL handshake failed');
      }
      if ((e as any).message?.includes('timeout')) {
        this.logger.error('🔴 Connection timeout - check network');
      }
      if ((e as any).message?.includes('ECONNREFUSED')) {
        this.logger.error('🔴 Connection refused');
      }

      throw e;
    }
  }
}
