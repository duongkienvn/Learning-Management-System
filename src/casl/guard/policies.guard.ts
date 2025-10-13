import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl-ability.factory/casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../decorator/check-policies.decorator';
import { IPolicyHandler } from '../policy-handler.interface';
import { IS_PUBLIC_KEY } from '../../auth/decorator/public.decorator';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): any {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const policyHandlers =
      this.reflector.getAllAndOverride<IPolicyHandler[]>(CHECK_POLICIES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) => {
      ForbiddenError.from(ability).throwUnlessCan(
        handler.action,
        handler.subject,
      );
      return true;
    });
  }
}
