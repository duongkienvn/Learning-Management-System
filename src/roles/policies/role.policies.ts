import { IPolicyHandler } from '../../casl/policy-handler.interface';
import { Action } from '../../casl/casl-ability.factory/casl-ability.factory';
import { Role } from '../entities/role.entity';

export class ManageRolePolicyHandler implements IPolicyHandler {
  action: Action.Manage;
  subject: Role;
}
