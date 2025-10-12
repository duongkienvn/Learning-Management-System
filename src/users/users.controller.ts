import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserOwnershipGuard } from '../auth/guard/user-ownership.guard';
import {CacheInterceptor} from "@nestjs/cache-manager";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('ADMIN')
  async findAll(): Promise<UserResponseDto[]> {
    console.log('user controller');
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(UserOwnershipGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    console.log('find one user');
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(UserOwnershipGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(UserOwnershipGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: `User with id ${id} has been removed.` };
  }
}
