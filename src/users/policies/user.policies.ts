import {IPolicyHandler} from "../../casl/policy-handler.interface";
import {Action} from "../../casl/casl-ability.factory/casl-ability.factory";
import {User} from "../entities/user.entity";

export class ReadUserPolicyHandler implements IPolicyHandler {
  action = Action.Read;
  subject = User;
}

export class UpdateUserPolicyHandler implements IPolicyHandler {
  action = Action.Update;
  subject = User;
}

export class DeleteUserPolicyHandler implements IPolicyHandler {
  action = Action.Delete;
  subject = User;
}

export class ManageUserPolicyHandler implements IPolicyHandler {
  action = Action.Manage;
  subject = User;
}
