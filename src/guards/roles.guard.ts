import { Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import PermissionDeniedException from '../exceptions/roles/PermissionDenied.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!this.matchRoles(roles, user.role)) {
      throw new PermissionDeniedException();
    }

    return true;
  }

  private matchRoles(roles: string[], userRole: string): boolean {
    return roles.includes(userRole);
  }
}
