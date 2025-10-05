import { LessonResponseDto } from '../../lessons/dto/lesson-response.dto';
import { Transform, Type } from 'class-transformer';
import dayjs from 'dayjs';

export class CourseResponseDto {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'))
  createdAt: Date;
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'))
  updatedAt: Date;
  @Type(() => LessonResponseDto)
  lesson?: LessonResponseDto;
}
