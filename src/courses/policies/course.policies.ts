import { IPolicyHandler } from '../../casl/policy-handler.interface';
import { Action } from '../../casl/casl-ability.factory/casl-ability.factory';
import { Course } from '../entities/course.entity';

export class CreateCoursePolicyHandler implements IPolicyHandler {
  action = Action.Read;
  subject = Course;
}

export class UpdateCoursePolicyHandler implements IPolicyHandler {
  action = Action.Update;
  subject = Course;
}

export class DeleteCoursePolicyHandler implements IPolicyHandler {
  action = Action.Delete;
  subject = Course;
}
