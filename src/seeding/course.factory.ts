import {setSeederFactory} from "typeorm-extension";
import {Course} from "../courses/entities/course.entity";
import {faker} from "@faker-js/faker";

export const CourseFactory = setSeederFactory(Course, () => {
  const course = new Course();
  course.title = faker.lorem.words(3);
  course.description = faker.lorem.sentence(3);
  course.isPublished = faker.datatype.boolean();
  course.createdAt = faker.date.past();
  course.updatedAt = faker.date.recent();

  return course;
});