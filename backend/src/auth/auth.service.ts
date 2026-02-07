import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(dto: RegisterUserDto) {
    this.logger.log(`Registering new user: ${dto.email}`);
    const existing = await this.userService.findOne(dto.email);
    if (existing) {
      this.logger.warn(
        `Registration failed: Email ${dto.email} already in use`
      );
      throw new ConflictException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.userService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    const tokens = await this.getTokens(user.id, user.email, 0);
    await this.updateRefreshToken(user.id, tokens.refresh_token, 0);
    this.logger.log(`User registered successfully: ${user.id}`);
    return tokens;
  }

  async login(user: Partial<User>) {
    if (!user.id || !user.email) {
      this.logger.error('Login failed: User data incomplete');
      throw new UnauthorizedException('User data incomplete');
    }
    // Get full user to access tokenVersion
    const fullUser = await this.userService.findById(user.id);
    if (!fullUser) {
      throw new UnauthorizedException('User not found');
    }

    const tokens = await this.getTokens(
      fullUser.id,
      fullUser.email,
      fullUser.tokenVersion
    );
    await this.updateRefreshToken(
      fullUser.id,
      tokens.refresh_token,
      fullUser.tokenVersion
    );
    this.logger.debug(`User logged in: ${user.email}`);
    return tokens;
  }

  async validateUser(
    email: string,
    pass: string
  ): Promise<Partial<User> | null> {
    const user = await this.userService.findOne(email);
    if (!user) {
      this.logger.debug(`Validate user failed: ${email} not found`);
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    this.logger.debug(`Validate user failed: Password mismatch for ${email}`);
    return null;
  }

  async loginWithCredentials(dto: LoginUserDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.login(user);
  }

  async logout(userId: string) {
    return this.userService.update(userId, { hashedRefreshToken: null });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.hashedRefreshToken) {
      this.logger.warn(`Refresh denied: User ${userId} not found or no token`);
      throw new ForbiddenException('Access Denied');
    }

    // Verify the refresh token matches
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken
    );

    if (!refreshTokenMatches) {
      // Token reuse detected - possible theft!
      this.logger.error(
        `SECURITY: Token reuse detected for user ${userId}. Invalidating all tokens.`
      );
      await this.invalidateAllTokens(userId);
      throw new ForbiddenException('Access Denied - Token Reuse Detected');
    }

    // Verify token version from JWT payload
    try {
      const payload = this.jwtService.decode(refreshToken) as any;
      if (
        payload.version !== undefined &&
        payload.version !== user.tokenVersion
      ) {
        this.logger.error(
          `SECURITY: Invalid token version for user ${userId}. Invalidating all tokens.`
        );
        await this.invalidateAllTokens(userId);
        throw new ForbiddenException('Access Denied - Invalid Token Version');
      }
    } catch (error) {
      this.logger.error(`Token decode error for user ${userId}:`, error);
      throw new ForbiddenException('Access Denied');
    }

    // Generate new tokens with incremented version
    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.tokenVersion + 1
    );
    await this.updateRefreshToken(
      user.id,
      tokens.refresh_token,
      user.tokenVersion + 1
    );

    this.logger.debug(
      `Tokens refreshed for user: ${userId}, version: ${user.tokenVersion + 1}`
    );
    return tokens;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
    version?: number
  ) {
    const hash = await bcrypt.hash(refreshToken, 10);
    const updateData: any = {
      hashedRefreshToken: hash,
    };

    if (version !== undefined) {
      updateData.tokenVersion = version;
    }

    await this.userService.update(userId, updateData);
  }

  async getTokens(userId: string, email: string, version: number = 0) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          version,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        }
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  /**
   * Invalidate all refresh tokens for a user
   * Used when token reuse is detected or password is changed
   */
  async invalidateAllTokens(userId: string) {
    this.logger.warn(`Invalidating all tokens for user: ${userId}`);
    const user = await this.userService.findById(userId);
    if (user) {
      await this.userService.update(userId, {
        hashedRefreshToken: null,
        tokenVersion: user.tokenVersion + 1,
      });
    }
  }

  /**
   * Change user password
   * Invalidates all existing tokens for security
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      this.logger.warn(`Failed password change attempt for user: ${userId}`);
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and invalidate all tokens
    await this.userService.update(userId, {
      password: hashedPassword,
      hashedRefreshToken: null,
      tokenVersion: user.tokenVersion + 1,
    });

    this.logger.log(`Password changed successfully for user: ${userId}`);
    return { message: 'Password changed successfully. Please login again.' };
  }
}
