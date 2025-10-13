import { Action, Subjects } from './casl-ability.factory/casl-ability.factory';

export interface IPolicyHandler {
  action: Action;
  subject: Subjects;
}
