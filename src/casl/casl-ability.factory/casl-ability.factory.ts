import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';
import { Injectable } from '@nestjs/common';
import { Role } from '../../roles/entities/role.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = InferSubjects<
  typeof User | typeof Course | typeof Lesson | typeof Role | 'all'
>;
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    if (!user) {
      can(Action.Read, Course);
      return build();
    }

    if (user.role.name === 'ADMIN') {
      can(Action.Manage, 'all');
      return build();
    }

    if (user.role.name === 'TEACHER') {
      can(Action.Create, Course);
      can(Action.Read, Course);

      can([Action.Update, Action.Delete], Course, { createdBy: user.id });

      can(Action.Create, Lesson);
      can(Action.Read, Lesson);
      // can([Action.Update, Action.Delete], Lesson, { course: { createdBy: user.id } });
      can([Action.Update, Action.Delete], Lesson, { courseOwnerId: user.id });
    } else {
      can(Action.Read, Course);
      can(Action.Read, Lesson);
      // can(Action.Update, Lesson, ['completed', 'progress'], { user: { id: user.id } })
      can(Action.Update, Lesson, ['completed', 'progress'], {
        registeredUserId: user.id,
      });
    }

    can([Action.Read, Action.Update, Action.Delete], User, { id: user.id });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
