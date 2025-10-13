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
  @Column()
  password: string;
  @Column({ nullable: true })
  hashedRefreshToken: string;
  @ManyToOne(() => Role, (role) => role.users, {
    eager: true,
    onDelete: 'CASCADE',
  })
  role: Role;
  @OneToMany(() => Lesson, (lesson) => lesson.user)
  lessons: Lesson[];
}
