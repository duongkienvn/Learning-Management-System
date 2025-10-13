import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Repository } from 'typeorm';
import { LessonResponseDto } from './dto/lesson-response.dto';
import { plainToInstance } from 'class-transformer';
import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import {Action, CaslAbilityFactory} from '../casl/casl-ability.factory/casl-ability.factory';
import {ForbiddenError} from "@casl/ability";

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async create(createLessonDto: CreateLessonDto): Promise<LessonResponseDto> {
    const userId = createLessonDto.userId;
    const courseId = createLessonDto.courseId;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    if (!course.isPublished) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const content = createLessonDto.content;

    const lesson = this.lessonRepository.create({
      user,
      course,
      content,
      completed: false,
      progress: 0,
    });

    const savedLesson = await this.lessonRepository.save(lesson);

    return plainToInstance(LessonResponseDto, savedLesson, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<LessonResponseDto[]> {
    const lessons = await this.lessonRepository.find({
      relations: ['user', 'course'],
    });

    return plainToInstance(LessonResponseDto, lessons, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number): Promise<LessonResponseDto> {
    const lesson = await this.findLessonById(id);
    return plainToInstance(LessonResponseDto, lesson, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: number,
    updateLessonDto: UpdateLessonDto,
    userReq: User,
  ): Promise<LessonResponseDto> {
    const lesson = await this.findLessonById(id);

    const ability = this.caslAbilityFactory.createForUser(userReq);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, lesson);

    Object.assign(lesson, updateLessonDto);
    const updatedLesson = await this.lessonRepository.save(lesson);
    return plainToInstance(LessonResponseDto, updatedLesson, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number, user: User): Promise<void> {
    const lesson = await this.findLessonById(id);

    const ability = this.caslAbilityFactory.createForUser(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Delete, lesson);

    await this.lessonRepository.remove(lesson);
  }

  async markAsCompleted(id: number, user: User): Promise<LessonResponseDto> {
    const lesson = await this.findLessonById(id);

    const ability = this.caslAbilityFactory.createForUser(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, lesson);

    lesson.completed = true;
    lesson.progress = 1.0;
    const updatedLesson = await this.lessonRepository.save(lesson);
    return plainToInstance(LessonResponseDto, updatedLesson, {
      excludeExtraneousValues: true,
    });
  }

  async updateProgress(
    id: number,
    progress: number,
    user: User
  ): Promise<LessonResponseDto> {
    const lesson = await this.findLessonById(id);

    const ability = this.caslAbilityFactory.createForUser(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, lesson);

    lesson.progress = Math.min(1, Math.max(0, progress));
    lesson.completed = lesson.progress === 1;
    const updatedLesson = await this.lessonRepository.save(lesson);
    return plainToInstance(LessonResponseDto, updatedLesson, {
      excludeExtraneousValues: true,
    });
  }

  async getLessonsByCourse(courseId: number): Promise<LessonResponseDto[]> {
    const lessons = await this.lessonRepository.find({
      where: { course: { id: courseId } },
      relations: ['user'],
    });
    return plainToInstance(LessonResponseDto, lessons, {
      excludeExtraneousValues: true,
    });
  }

  private async findLessonById(id: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['user', 'course'],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with id ${id} not found!`);
    }

    lesson.courseOwnerId = lesson.course.createdBy;
    lesson.registeredUserId = lesson.user.id;

    return lesson;
  }
}
