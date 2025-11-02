import { Controller, Get, Render, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { UsuarioAtual } from './auth/usuario-atual.decorator';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Usuario } from './usuarios/usuario.entity';

@Controller()
export class AppController {
  constructor(private readonly jwtService: JwtService) {}

  @Get()
  async redirecionarRaiz(
    @Req() requisicao: Request,
    @Res({ passthrough: true }) resposta: Response,
  ) {
    const token = requisicao.cookies?.token;

    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token);
        resposta.redirect('/cifra/criptografar');
        return { usuario: payload };
      } catch (error) {
        resposta.clearCookie('token');
      }
    }

    resposta.redirect('/auth/login');
  }

  @Get('menu')
  @UseGuards(JwtAuthGuard)
  @Render('menu/index')
  exibirMenu(@UsuarioAtual() usuario: Usuario) {
    return { usuario };
  }
}
