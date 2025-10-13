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
  Req,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonResponseDto } from './dto/lesson-response.dto';
import { CheckPolicies } from '../casl/decorator/check-policies.decorator';
import {
  CreateLessonPolicyHandler,
  DeleteLessonPolicyHandler,
  ReadLessonPolicyHandler,
  UpdateLessonPolicyHandler,
} from './policies/lesson.policies';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @CheckPolicies(new CreateLessonPolicyHandler())
  async create(
    @Body() createLessonDto: CreateLessonDto,
  ): Promise<LessonResponseDto> {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  @CheckPolicies(new ReadLessonPolicyHandler())
  async findAll(): Promise<LessonResponseDto[]> {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  @CheckPolicies(new ReadLessonPolicyHandler())
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LessonResponseDto> {
    return this.lessonsService.findOne(id);
  }

  @Put(':id')
  @CheckPolicies(new UpdateLessonPolicyHandler())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLessonDto: UpdateLessonDto,
    @Req() req: any,
  ): Promise<LessonResponseDto> {
    return this.lessonsService.update(id, updateLessonDto, req.user);
  }

  @Delete(':id')
  @CheckPolicies(new DeleteLessonPolicyHandler())
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<{ message: string }> {
    await this.lessonsService.remove(id, req.user);
    return { message: `Lesson with id ${id} has been deleted!` };
  }

  @Patch(':id/complete')
  @CheckPolicies(new UpdateLessonPolicyHandler())
  async markAsCompleted(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any
  ): Promise<LessonResponseDto> {
    return this.lessonsService.markAsCompleted(id, req.user);
  }

  @Patch(':id/progress')
  @CheckPolicies(new UpdateLessonPolicyHandler())
  async updateProgress(
    @Param('id', ParseIntPipe) id: number,
    @Query('value') value: string,
    @Req() req: any
  ): Promise<LessonResponseDto> {
    return this.lessonsService.updateProgress(id, parseFloat(value), req.user);
  }

  @Get('courses/:courseId')
  @CheckPolicies(new ReadLessonPolicyHandler())
  async getLessonsByCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<LessonResponseDto[]> {
    return this.lessonsService.getLessonsByCourse(courseId);
  }
}
