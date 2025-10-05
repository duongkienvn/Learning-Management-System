import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLessonDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  @IsNumber()
  @IsNotEmpty()
  courseId: number;
}
