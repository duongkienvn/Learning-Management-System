import {setSeederFactory} from "typeorm-extension";
import {Lesson} from "../lessons/entities/lesson.entity";
import {faker} from "@faker-js/faker";

export const LessonFactory = setSeederFactory(Lesson, () => {
  const lesson = new Lesson();
  lesson.content = faker.lorem.sentence(7);
  lesson.completed = faker.datatype.boolean();
  lesson.progress = faker.number.float({ min: 0, max: 1, multipleOf: 0.1 });

  return lesson;
})