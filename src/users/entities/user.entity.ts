import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 100 })
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ nullable: true })
  password: string;
  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Role;
  @OneToMany(() => Lesson, (lesson) => lesson.user)
  lessons: Lesson[];
}
