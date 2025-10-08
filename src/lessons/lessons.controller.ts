import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonResponseDto } from './dto/lesson-response.dto';
import { Roles } from '../auth/decorator/roles.decorator';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @Roles('ADMIN')
  async create(
    @Body() createLessonDto: CreateLessonDto,
  ): Promise<LessonResponseDto> {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  @Roles('ADMIN', 'USER')
  async findAll(): Promise<LessonResponseDto[]> {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LessonResponseDto> {
    return this.lessonsService.findOne(id);
  }

  @Put(':id')
  @Roles('ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<LessonResponseDto> {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.lessonsService.remove(id);
    return { message: `Lesson with id ${id} has been deleted!` };
  }

  @Patch(':id/complete')
  @Roles('ADMIN', 'USER')
  async markAsCompleted(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LessonResponseDto> {
    return this.lessonsService.markAsCompleted(id);
  }

  @Patch(':id/progress')
  @Roles('ADMIN', 'USER')
  async updateProgress(
    @Param('id', ParseIntPipe) id: number,
    @Query('value') value: string,
  ): Promise<LessonResponseDto> {
    return this.lessonsService.updateProgress(id, parseFloat(value));
  }

  @Get('courses/:courseId')
  @Roles('ADMIN', 'USER')
  async getLessonsByCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<LessonResponseDto[]> {
    return this.lessonsService.getLessonsByCourse(courseId);
  }
}
