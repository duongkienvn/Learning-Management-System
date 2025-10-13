import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { faker } from '@faker-js/faker';

export default class MainSeeder implements Seeder {
  public async run(
    datasource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = await factoryManager.get(User);
    const courseFactory = await factoryManager.get(Course);
    const lessonFactory = await factoryManager.get(Lesson);

    const roleRepository = datasource.getRepository(Role);
    const userRepository = datasource.getRepository(User);
    const lessonRepository = datasource.getRepository(Lesson);
    const courseRepository = datasource.getRepository(Course);

    // --- Roles ---
    let adminRole = await roleRepository.findOne({ where: { name: 'ADMIN' } });
    if (!adminRole) {
      adminRole = roleRepository.create({ name: 'ADMIN' });
      await roleRepository.save(adminRole);
    }

    let userRole = await roleRepository.findOne({ where: { name: 'USER' } });
    if (!userRole) {
      userRole = roleRepository.create({ name: 'USER' });
      await roleRepository.save(userRole);
    }

    let teacherRole = await roleRepository.findOne({ where: { name: 'TEACHER' } });
    if (!teacherRole) {
      teacherRole = roleRepository.create({ name: 'TEACHER' });
      await roleRepository.save(teacherRole);
    }

    // --- Users ---
    const users = await userFactory.saveMany(15);

    users[0].role = adminRole;
    users[1].role = teacherRole;
    users[2].role = teacherRole;
    users[3].role = teacherRole;

    for (let i = 4; i < users.length; i++) {
      users[i].role = userRole;
    }
    await userRepository.save(users);

    const teacherUsers = users.filter((u) => u.role.name === 'TEACHER');

    // --- Courses ---
    const courses = await courseFactory.saveMany(20);

    for (const course of courses) {
      const teacher = faker.helpers.arrayElement(teacherUsers);
      course.createdBy = teacher.id;
      course.updatedBy = teacher.id;
    }

    await courseRepository.save(courses);

    // --- Lessons ---
    for (const user of users) {
      const sampleCourses = faker.helpers.arrayElements(
        courses,
        faker.number.int({ min: 2, max: 4 }),
      );

      for (const course of sampleCourses) {
        const lesson = await lessonFactory.make();
        lesson.user = user;
        lesson.course = course;
        await lessonRepository.save(lesson);
      }
    }
  }
}
