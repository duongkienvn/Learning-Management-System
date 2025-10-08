import {setSeederFactory} from "typeorm-extension";
import {Role} from "../roles/entities/role.entity";
import {faker} from "@faker-js/faker";

export const RoleFactory = setSeederFactory(Role, () => {
  const role = new Role();
  const roles = ['ADMIN', 'USER'];
  role.name = faker.helpers.arrayElement(roles);

  return role;
})