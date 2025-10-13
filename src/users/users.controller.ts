import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CheckPolicies } from '../casl/decorator/check-policies.decorator';
import {
  DeleteUserPolicyHandler, ManageUserPolicyHandler,
  ReadUserPolicyHandler,
  UpdateUserPolicyHandler,
} from './policies/user.policies';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @CheckPolicies(new ManageUserPolicyHandler())
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @CheckPolicies(new ReadUserPolicyHandler())
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<UserResponseDto> {
    const userReq = req.user;
    return this.usersService.findOne(id, userReq);
  }

  @Put(':id')
  @CheckPolicies(new UpdateUserPolicyHandler())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @Delete(':id')
  @CheckPolicies(new DeleteUserPolicyHandler())
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any
  ): Promise<{ message: string }> {
    await this.usersService.remove(id, req.user);
    return { message: `User with id ${id} has been removed.` };
  }
}
