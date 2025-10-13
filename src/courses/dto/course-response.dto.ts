import { LessonResponseDto } from '../../lessons/dto/lesson-response.dto';
import {Exclude, Expose, Transform, Type} from 'class-transformer';
import dayjs from 'dayjs';
import {UserResponseDto} from "../../users/dto/user-response.dto";

@Exclude()
export class CourseResponseDto {
  @Expose()
  id: string;
  @Expose()
  title: string;
  @Expose()
  description: string;
  @Expose()
  isPublished: boolean;
  @Expose()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'))
  createdAt: Date;
  @Expose()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'))
  updatedAt: Date;
  @Expose()
  createdBy: number;
  @Expose()
  updatedBy: number;
  @Expose()
  @Type(() => LessonResponseDto)
  lessons?: LessonResponseDto[];
}
