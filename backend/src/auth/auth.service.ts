import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterUserDto) {
    const existing = await this.userService.findOne(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
<<<<<<< HEAD
    const hashedPassword = await bcrypt.hash(dto.password, 10);
=======
    const hashedPassword = await bcrypt.hash(dto.password, 12);
>>>>>>> c7e00d1 (swap)
    const user = await this.userService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });
    return this.login(user); // Auto login on register
  }

  async login(user: Partial<User>) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(
    email: string,
    pass: string
  ): Promise<Partial<User> | null> {
    const user = await this.userService.findOne(email);
<<<<<<< HEAD
    console.log(`Validating user: ${email}`, user ? 'Found' : 'Not Found');
    if (!user) return null;

    const isMatch = await bcrypt.compare(pass, user.password);
    console.log(`Password match for ${email}:`, isMatch);
=======

    if (!user) return null;

    const isMatch = await bcrypt.compare(pass, user.password);
>>>>>>> c7e00d1 (swap)

    if (isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async loginWithCredentials(dto: LoginUserDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.login(user);
  }
}
