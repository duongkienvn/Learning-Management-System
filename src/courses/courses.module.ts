import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import {RedisProvider} from "../redis/redis.provider";
import {CaslModule} from "../casl/casl.module";

@Module({
  imports: [TypeOrmModule.forFeature([Course, Lesson]), CaslModule],
  controllers: [CoursesController],
  providers: [CoursesService, RedisProvider],
})
export class CoursesModule {}
