import 'dotenv/config'; // 👈 BẮT BUỘC để load env
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import MainSeeder from './main.seeder';
import { UserFactory } from './user.factory';
import { RoleFactory } from './role.factory';
import { CourseFactory } from './course.factory';
import { LessonFactory } from './lesson.factory';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  extra: {
    max: 2,
  },

  ssl: {
    rejectUnauthorized: false,
  },

  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  factories: [UserFactory, RoleFactory, CourseFactory, LessonFactory],
  seeds: [MainSeeder],

  synchronize: false,
  logging: true,
};

const datasource = new DataSource(options);

async function bootstrap() {
  try {
    await datasource.initialize();
    console.log('DB connected');
    console.log({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
    });


    await runSeeders(datasource);
    console.log('Seeding completed');

    await datasource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed', error);
    process.exit(1);
  }
}

bootstrap();
