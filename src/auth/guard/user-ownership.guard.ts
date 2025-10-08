import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserOwnershipGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const targetUserId = parseInt(request.params.id, 10);

    if (user.role?.name === 'ADMIN') {
      return true;
    }

    if (user.id === targetUserId) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to perform this action',
    );
  }
}
