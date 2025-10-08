import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import {Injectable} from "@nestjs/common";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      secretOrKey: configService.get<string>('REFRESH_SECRET_KEY'),
      ignoreExpiration: true,
    });
  }

  validateRefreshToken(userId: number, req: Request) {
    const refreshToken = req.get('authorization')?.replace('Bearer', '').trim();
    if (typeof refreshToken === 'string') {
      return this.authService.validateRefreshToken(userId, refreshToken);
    }
  }
}
