import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { CourseResponseDto } from './dto/course-response.dto';
import { plainToInstance } from 'class-transformer';
import { LessonResponseDto } from '../lessons/dto/lesson-response.dto';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<CourseResponseDto> {
    const course = this.courseRepository.create({
      ...createCourseDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: false,
    });

    const savedCourse = await this.courseRepository.save(course);

    return plainToInstance(CourseResponseDto, savedCourse, {
      excludeExtraneousValues: true
    });
  }

  async findAll(query: PaginateQuery): Promise<Paginated<CourseResponseDto>> {
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

    return {
      ...paginated,
      data: dbData,
    } as Paginated<CourseResponseDto>;
  }

  async findOne(id: number): Promise<CourseResponseDto> {
    const course = await this.findCourseById(id);

    return plainToInstance(CourseResponseDto, course, {
      excludeExtraneousValues: true
    });
  }

  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<CourseResponseDto> {
    const course = await this.findCourseById(id);
    Object.assign(course, {
      ...updateCourseDto,
      updatedAt: new Date(),
    });
    const updatedCourse = await this.courseRepository.save(course);

    return plainToInstance(CourseResponseDto, updatedCourse, {
      excludeExtraneousValues: true
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
  }

  async publishCourse(id: number): Promise<CourseResponseDto> {
    const course = await this.findCourseById(id);
    if (!course.isPublished) {
      course.isPublished = true;
      course.updatedAt = new Date();
      const updatedCourse = await this.courseRepository.save(course);
      return plainToInstance(CourseResponseDto, updatedCourse);
    }
    return plainToInstance(CourseResponseDto, course, {
      excludeExtraneousValues: true
    });
  }

  async getLessonsByCourse(id: number): Promise<LessonResponseDto[]> {
    const course = await this.findCourseById(id);
    return plainToInstance(LessonResponseDto, course.lessons, {
      excludeExtraneousValues: true
    });
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
}
