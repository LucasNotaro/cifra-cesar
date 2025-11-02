import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CadastroDto } from './dto/cadastro.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Render('auth/login')
  mostrarLogin(
    @Query('erro') erro?: string,
    @Query('sucesso') sucesso?: string,
  ) {
    return { erro, sucesso };
  }

  @Get('cadastro')
  @Render('auth/cadastro')
  mostrarCadastro(
    @Query('erro') erro?: string,
    @Query('sucesso') sucesso?: string,
  ) {
    return { erro, sucesso };
  }

  @Post('login')
  async realizarLogin(@Body() dto: LoginDto, @Res() resposta: Response) {
    try {
      const usuario = await this.authService.validarUsuario(
        dto.email,
        dto.senha,
      );
      const token = await this.authService.gerarToken(usuario);

      resposta.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 1000,
      });

      resposta.redirect('/cifra/criptografar');
    } catch (error) {
      const mensagem = this.resolverMensagemErro(error);
      resposta.redirect(`/auth/login?erro=${encodeURIComponent(mensagem)}`);
    }
  }

  @Post('cadastro')
  async realizarCadastro(@Body() dto: CadastroDto, @Res() resposta: Response) {
    if (dto.senha !== dto.confirmarSenha) {
      resposta.redirect(
        `/auth/cadastro?erro=${encodeURIComponent('As senhas nao conferem.')}`,
      );
      return;
    }

    try {
      const usuario = await this.authService.cadastrar(
        dto.nomeUsuario,
        dto.email,
        dto.senha,
      );
      const token = await this.authService.gerarToken(usuario);

      resposta.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 1000,
      });

      resposta.redirect('/cifra/criptografar');
    } catch (error) {
      const mensagem = this.resolverMensagemErro(error);
      resposta.redirect(`/auth/cadastro?erro=${encodeURIComponent(mensagem)}`);
    }
  }

  @Get('logout')
  async realizarLogout(@Res() resposta: Response) {
    resposta.clearCookie('token');
    resposta.redirect('/auth/login');
  }

  private resolverMensagemErro(error: unknown): string {
    if (error instanceof HttpException) {
      const response = error.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        const message = (response as { message: unknown }).message;
        if (Array.isArray(message)) {
          return message[0];
        }
        if (typeof message === 'string') {
          return message;
        }
      }
      return error.message;
    }

    return 'Ocorreu um erro inesperado.';
  }
}
