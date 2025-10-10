import {Exclude, Expose, Transform} from 'class-transformer';

@Exclude()
export class LessonResponseDto {
  @Expose()
  id: number;
  @Expose()
  content: string;
  @Expose()
  completed: boolean;
  @Expose()
  progress: number;
  @Expose()
  @Transform(({ obj }) => obj.user?.id)
  userId: number;
  @Expose()
  @Transform(({ obj }) => obj.course?.id)
  courseId: number;
}
