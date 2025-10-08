import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import MainSeeder from './main.seeder';
import { UserFactory } from './user.factory';
import { RoleFactory } from './role.factory';
import { CourseFactory } from './course.factory';
import { LessonFactory } from './lesson.factory';
import process from 'node:process';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'kien2005',
  database: 'lms',
  factories: [UserFactory, RoleFactory, CourseFactory, LessonFactory],
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  seeds: [MainSeeder],
};

const datasource = new DataSource(options);
datasource.initialize().then(async () => {
  await datasource.synchronize(true);
  await runSeeders(datasource);
  process.exit();
});
