import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonDto } from './create-lesson.dto';
import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
