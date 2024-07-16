import { MessagesError } from '@/shared/errors/MessagesErrors';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(MessagesError.TOKEN_NOT_FOUND);
    }
    try {
      const payload = await this.jwtService.verify(token);
      const user = {
        idRecruitment: payload.sub,
        email: payload.email,
      };
      request['user'] = user;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(MessagesError.TOKEN_INVALID);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.headers['authorization'];
    return token;
  }
}
