import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import {Action, CaslAbilityFactory} from '../casl/casl-ability.factory/casl-ability.factory';
import {ForbiddenError} from "@casl/ability";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      relations: ['role'],
    });

    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findOne(id: number, userReq: User): Promise<UserResponseDto> {
    const user = await this.findUserById(id);

    const ability = this.caslAbilityFactory.createForUser(userReq);
    ForbiddenError.from(ability).throwUnlessCan(Action.Read, user);

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    userReq: User
  ): Promise<UserResponseDto> {
    const existingUser = await this.findUserById(id);

    const ability = this.caslAbilityFactory.createForUser(userReq);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, existingUser);

    Object.assign(existingUser, updateUserDto);

    const updatedUser = await this.userRepository.save(existingUser);

    return plainToInstance(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number, userReq: User): Promise<void> {
    const existingUser = await this.findUserById(id);
    const ability = this.caslAbilityFactory.createForUser(userReq);
    ForbiddenError.from(ability).throwUnlessCan(Action.Delete, existingUser);
  }

  async updateHashedRefreshToken(userId: number, hashedRefreshToken: any) {
    await this.findUserById(userId);
    return await this.userRepository.update(
      { id: userId },
      { hashedRefreshToken },
    );
  }
}
