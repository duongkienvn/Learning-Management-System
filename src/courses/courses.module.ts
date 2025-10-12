import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import {RedisProvider} from "../redis/redis.provider";

@Module({
  imports: [TypeOrmModule.forFeature([Course, Lesson])],
  controllers: [CoursesController],
  providers: [CoursesService, RedisProvider],
})
export class CoursesModule {}
