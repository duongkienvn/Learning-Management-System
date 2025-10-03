import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: false })
  completed: boolean;
  @Column({ type: 'float', nullable: false })
  progress: number;
  @ManyToOne(() => User, (user) => user.lessons)
  user: User;
  @ManyToOne(() => Course, (course) => course.lessons)
  course: Course;
}
