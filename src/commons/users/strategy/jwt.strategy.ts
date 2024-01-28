import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayloadType } from '../types';
import { OrNeverType } from '../../general';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'X143enGUWHKTLNLfu5FzYV9C/mbguN98aU+lj8zElOiwW1+3f7yp5TDI56GlwC3Dzaj7NDOKRSKHJ3wXCZ/KoVZjMcaYI8YG6TL3hSGrPnyz10BnSY4772t8Kcqg789/PRh5eydASDiqcIh+/kkjaCpFs+uaET20jyHBjbsttrTYt7NOTRuK+FaHmBBTifQDfIdl5ezVDAUWagXvpaNuuikjN/SkX5MOVH56V1EUSCOozzAeC+Lq+SW4q19PCUrjDaJREOuz27TsW34fOT37/25PN6QfcL0znmfib/aDCdL0dxmP4jG0zHqFM8dK95lZruyMX7l54IzpAW1yAf+R0A==',
    });
  }
  public validate(payload: JwtPayloadType): OrNeverType<JwtPayloadType> {
    if (!payload.id) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
