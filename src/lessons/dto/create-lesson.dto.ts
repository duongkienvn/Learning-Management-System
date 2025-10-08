import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class CreateLessonDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  @IsNumber()
  @IsNotEmpty()
  courseId: number;
  @IsString()
  @IsNotEmpty()
  content: string;
}
