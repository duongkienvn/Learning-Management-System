import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/entities/role.entity';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import * as argon2 from 'argon2';
import refreshJwtConfig from './config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';
import {UsersService} from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const { name, email, password } = createUserDto;

    const hasEmail = await this.userRepository.exists({
      where: { email },
    });
    if (hasEmail) {
      throw new BadRequestException('Email already exists!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultRole = await this.roleRepository.findOne({
      where: { name: 'USER' },
    });

    if (!defaultRole) {
      throw new BadRequestException(
        'Default role "user" not found. Please create it first.',
      );
    }

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: defaultRole,
    });
    await this.userRepository.save(user);

    return user;
  }

  async login(email: string, password: string): Promise<any> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (!existingUser || !existingUser.password) {
      throw new UnauthorizedException('Email or password is incorrect!');
    }

    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      throw new UnauthorizedException('email or password is incorrect!');
    }

    const { accessToken, refreshToken } = await this.generateToken(existingUser.id);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(existingUser.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role.name,
      },
    };
  }

  async validateUser(payload: any): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async validateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const refreshTokenMatches = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches)
      throw new UnauthorizedException('Invalid Refresh Token');

    return { id: userId };
  }

  async refreshToken(userId: number) {
    const { accessToken, refreshToken } = await this.generateToken(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return {
      id: userId,
      accessToken,
      refreshToken
    }
  }

  async generateToken(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ id: userId }),
      this.jwtService.signAsync({ id: userId }, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signout(userId: number) {
    return await this.userService.updateHashedRefreshToken(userId, null);
  }
}
