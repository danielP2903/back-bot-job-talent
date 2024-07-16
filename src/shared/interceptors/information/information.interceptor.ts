import { ENDPOINTS_EXCLUDE } from '@/shared/enums/endpoints';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class InformationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const isExcludeInterceptor = this.verifyEndpointsExclude(request.route);
    if (!isExcludeInterceptor) {
      const user = request['user'];
      request.body.user = user;
      request.body.user = request['user'];
    }
    return next.handle();
  }

  private verifyEndpointsExclude(route: any): boolean {
    const isEndpointExclude = ENDPOINTS_EXCLUDE.some(
      (endpoint) =>
        endpoint.path === route.path && route.methods[endpoint.type] === true,
    );
    return isEndpointExclude;
  }
}
