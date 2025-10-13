import {ForbiddenException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { CourseResponseDto } from './dto/course-response.dto';
import { plainToInstance } from 'class-transformer';
import { LessonResponseDto } from '../lessons/dto/lesson-response.dto';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import Redis from 'ioredis';
import { User } from '../users/entities/user.entity';
import {Action, CaslAbilityFactory} from '../casl/casl-ability.factory/casl-ability.factory';
import {ForbiddenError} from "@casl/ability";

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    user: User,
  ): Promise<CourseResponseDto> {
    const course = this.courseRepository.create({
      ...createCourseDto,
      createdBy: user.id,
      updatedBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: false,
    });

    const savedCourse = await this.courseRepository.save(course);

    await this.clearCoursesCache();

    return plainToInstance(CourseResponseDto, savedCourse, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(query: PaginateQuery): Promise<Paginated<CourseResponseDto>> {
    const hashedQuery = crypto
      .createHash('md5')
      .update(JSON.stringify(query))
      .digest('hex');
    const cachedKey = `courses:all:${hashedQuery}`;

    const cached =
      await this.cacheManager.get<Paginated<CourseResponseDto>>(cachedKey);

    if (cached) return cached;

    const paginated = await paginate(query, this.courseRepository, {
      relations: ['lessons', 'lessons.user', 'lessons.course'],
      sortableColumns: ['createdAt', 'title'],
      defaultSortBy: [['createdAt', 'DESC']],
      searchableColumns: ['title', 'description'],
      maxLimit: 20,
      defaultLimit: 10,
    });

    const dbData = plainToInstance(CourseResponseDto, paginated.data, {
      excludeExtraneousValues: true,
    });

    const result = {
      ...paginated,
      data: dbData,
    } as Paginated<CourseResponseDto>;

    await this.cacheManager.set(cachedKey, result, 60 * 1000 * 30);

    return result;
  }

  async findOne(id: number): Promise<CourseResponseDto> {
    const cacheKey = `courses:${id}`;
    const cached = await this.cacheManager.get<CourseResponseDto>(cacheKey);
    if (cached) return cached;

    const course = await this.findCourseById(id);
    const result = plainToInstance(CourseResponseDto, course, {
      excludeExtraneousValues: true,
    });

    await this.cacheManager.set(cacheKey, result, 60 * 1000 * 10);

    return result;
  }

  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
    user: User,
  ): Promise<CourseResponseDto> {
    const course = await this.findCourseById(id);

    const ability = this.caslAbilityFactory.createForUser(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, course);

    Object.assign(course, {
      ...updateCourseDto,
      updatedAt: new Date(),
      updatedBy: user.id,
    });
    const updatedCourse = await this.courseRepository.save(course);

    await this.clearCoursesCache();

    return plainToInstance(CourseResponseDto, updatedCourse, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number, user: User): Promise<void> {
    const course = await this.findCourseById(id);

    const ability = this.caslAbilityFactory.createForUser(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Delete, course);

    await this.courseRepository.remove(course);
    await this.clearCoursesCache();
  }

  async publishCourse(id: number, user: User): Promise<CourseResponseDto> {
    const course = await this.findCourseById(id);

    const ability = this.caslAbilityFactory.createForUser(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, course);

    if (!course.isPublished) {
      course.isPublished = true;
      course.updatedAt = new Date();
      course.updatedBy = user.id;
      const updatedCourse = await this.courseRepository.save(course);
      return plainToInstance(CourseResponseDto, updatedCourse);
    }

    await this.clearCoursesCache();

    return plainToInstance(CourseResponseDto, course, {
      excludeExtraneousValues: true,
    });
  }

  async getLessonsByCourse(id: number): Promise<LessonResponseDto[]> {
    const cachKey = `courses:${id}:lessons`;
    const cached = await this.cacheManager.get<LessonResponseDto[]>(cachKey);

    if (cached) return cached;

    const course = await this.findCourseById(id);

    const lessons = plainToInstance(LessonResponseDto, course.lessons, {
      excludeExtraneousValues: true,
    });

    await this.cacheManager.set(cachKey, lessons, 60 * 1000 * 10);

    return lessons;
  }

  private async findCourseById(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['lessons', 'lessons.user', 'lessons.course'],
    });

    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    return course;
  }

  async clearCoursesCache(): Promise<void> {
    const keys = await this.redisClient.keys('courses:*');
    if (keys.length > 0) {
      await this.redisClient.del(...keys);
    }
  }
}
