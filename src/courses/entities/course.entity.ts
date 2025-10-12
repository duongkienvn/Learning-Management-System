import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Lesson} from '../../lessons/entities/lesson.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({length: 200})
  title: string;
  @Column('text')
  description: string;
  @Column({default: true})
  isPublished: boolean;
  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;
  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;
  @OneToMany(() => Lesson, (lesson) => lesson.course,
    {
      cascade: ['insert', 'update', 'remove'],
      orphanedRowAction: 'delete'
    })
  lessons: Lesson[];
}
