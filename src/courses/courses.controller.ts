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
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { LessonResponseDto } from '../lessons/dto/lesson-response.dto';
import { Public } from '../auth/decorator/public.decorator';
import { Roles } from '../auth/decorator/roles.decorator';
import type { Paginated, PaginateQuery } from 'nestjs-paginate';
import { Paginate } from 'nestjs-paginate';

@Controller('courses')
@Roles('ADMIN')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<CourseResponseDto> {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @Public()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<CourseResponseDto>> {
    return this.coursesService.findAll(query);
  }

  @Get(':id')
  @Public()
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CourseResponseDto> {
    return this.coursesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<CourseResponseDto> {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.coursesService.remove(id);
    return { message: `Course with id ${id} has been deleted.` };
  }

  @Patch(':id/publish')
  async publish(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CourseResponseDto> {
    return this.coursesService.publishCourse(id);
  }

  @Get(':id/lessons')
  @Public()
  async getLessons(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LessonResponseDto[]> {
    return this.coursesService.getLessonsByCourse(id);
  }
}
