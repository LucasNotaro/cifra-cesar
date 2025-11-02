import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepositorio: Repository<Usuario>,
  ) {}

  async criarUsuario(
    email: string,
    hashSenha: string,
    nomeUsuario: string,
  ): Promise<Usuario> {
    const emailNormalizado = email.trim().toLowerCase();
    const nomeUsuarioLimpo = nomeUsuario.trim();
    const usuario = this.usuariosRepositorio.create({
      email: emailNormalizado,
      nomeUsuario: nomeUsuarioLimpo,
      hashSenha,
    });
    return this.usuariosRepositorio.save(usuario);
  }

  buscarPorEmail(email: string): Promise<Usuario | null> {
    const emailNormalizado = email.trim().toLowerCase();
    return this.usuariosRepositorio.findOne({
      where: { email: emailNormalizado },
    });
  }

  buscarPorId(id: string): Promise<Usuario | null> {
    return this.usuariosRepositorio.findOne({ where: { id } });
  }
}
