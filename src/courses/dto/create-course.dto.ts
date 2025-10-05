import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required!' })
  @MaxLength(200, { message: 'Title must be less than 200 characters' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;
}
