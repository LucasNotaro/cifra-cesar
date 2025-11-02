import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/usuario.entity';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async cadastrar(
    nomeUsuario: string,
    email: string,
    senha: string,
  ): Promise<Usuario> {
    const emailNormalizado = email.trim().toLowerCase();
    const existente =
      await this.usuariosService.buscarPorEmail(emailNormalizado);

    if (existente) {
      throw new BadRequestException('Email ja cadastrado.');
    }

    const hashSenha = await bcrypt.hash(senha, 10);
    return this.usuariosService.criarUsuario(
      emailNormalizado,
      hashSenha,
      nomeUsuario,
    );
  }

  async validarUsuario(email: string, senha: string): Promise<Usuario> {
    const emailNormalizado = email.trim().toLowerCase();
    const usuario =
      await this.usuariosService.buscarPorEmail(emailNormalizado);

    if (!usuario) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.hashSenha);

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    return usuario;
  }

  async gerarToken(usuario: Usuario): Promise<string> {
    return this.jwtService.signAsync({
      sub: usuario.id,
      email: usuario.email,
      nomeUsuario: usuario.nomeUsuario,
    });
  }
}
