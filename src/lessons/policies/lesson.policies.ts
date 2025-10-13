import {IPolicyHandler} from "../../casl/policy-handler.interface";
import {Action} from "../../casl/casl-ability.factory/casl-ability.factory";
import {Lesson} from "../entities/lesson.entity";

export class CreateLessonPolicyHandler implements IPolicyHandler {
  action = Action.Create;
  subject = Lesson;
}

export class UpdateLessonPolicyHandler implements IPolicyHandler {
  action = Action.Update;
  subject = Lesson;
}

export class ReadLessonPolicyHandler implements IPolicyHandler {
  action = Action.Read;
  subject = Lesson;
}

export class DeleteLessonPolicyHandler implements IPolicyHandler {
  action = Action.Delete;
  subject = Lesson;
}