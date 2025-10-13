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
  Req,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import type { Paginated, PaginateQuery } from 'nestjs-paginate';
import { Paginate } from 'nestjs-paginate';
import { CheckPolicies } from '../casl/decorator/check-policies.decorator';
import {
  CreateCoursePolicyHandler,
  DeleteCoursePolicyHandler,
  UpdateCoursePolicyHandler,
} from './policies/course.policies';
import { Public } from '../auth/decorator/public.decorator';
import { User } from '../users/entities/user.entity';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @CheckPolicies(new CreateCoursePolicyHandler())
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @Req() req: any,
  ): Promise<CourseResponseDto> {
    const user = req.user;
    return this.coursesService.create(createCourseDto, user);
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
  @CheckPolicies(new UpdateCoursePolicyHandler())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req: any,
  ): Promise<CourseResponseDto> {
    const user = req.user;
    return this.coursesService.update(id, updateCourseDto, user);
  }

  @Delete(':id')
  @CheckPolicies(new DeleteCoursePolicyHandler())
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<{ message: string }> {
    const user: User = req.user;
    await this.coursesService.remove(id, user);
    return { message: `Course with id ${id} has been deleted.` };
  }

  @Patch(':id/publish')
  @CheckPolicies(new UpdateCoursePolicyHandler())
  async publish(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<CourseResponseDto> {
    const user = req.user;
    return this.coursesService.publishCourse(id, user);
  }
}
