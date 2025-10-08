import { setSeederFactory } from 'typeorm-extension';
import { User } from '../users/entities/user.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export const UserFactory = setSeederFactory(User, () => {
  const user = new User();
  user.name = faker.person.firstName();
  user.email = faker.internet.email();
  const rawPassword = '123456';
  user.password = bcrypt.hashSync(rawPassword, 10);

  return user;
});
