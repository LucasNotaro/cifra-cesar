import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.token ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'dev-secret-change-me',
      ),
    });
  }

  async validate(payload: { sub: string; nomeUsuario: string; email: string }) {
    const usuario = await this.usuariosService.buscarPorId(payload.sub);

    if (!usuario) {
      throw new UnauthorizedException('Usuario nao encontrado.');
    }

    return usuario;
  }
}
