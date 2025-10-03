import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Lesson, Role])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
