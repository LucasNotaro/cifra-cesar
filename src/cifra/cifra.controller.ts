import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  Render,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UsuarioAtual } from '../auth/usuario-atual.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Usuario } from '../usuarios/usuario.entity';
import { CifraService } from './cifra.service';
import { DecifrarDto } from './dto/decifrar.dto';
import { CriptografarDto } from './dto/criptografar.dto';

@Controller('cifra')
export class CifraController {
  constructor(private readonly cifraService: CifraService) {}

  @Get('criptografar')
  @UseGuards(JwtAuthGuard)
  @Render('cifra/criptografar')
  mostrarFormularioCriptografia(
    @UsuarioAtual() usuario: Usuario,
    @Query('textoCifrado') textoCifrado?: string,
    @Query('hash') hash?: string,
    @Query('mensagemOriginal') mensagemOriginal?: string,
    @Query('deslocamento') deslocamento?: string,
    @Query('erro') erro?: string,
    @Query('sucesso') sucesso?: string,
  ) {
    return {
      usuario,
      textoCifrado,
      hash,
      mensagemOriginal,
      deslocamento,
      erro,
      sucesso,
    };
  }

  @Post('criptografar')
  @UseGuards(JwtAuthGuard)
  async criptografar(
    @UsuarioAtual() usuario: Usuario,
    @Body() dto: CriptografarDto,
    @Res() resposta: Response,
  ) {
    try {
      const resultado = await this.cifraService.criptografar(
        dto.mensagem,
        dto.deslocamento,
        usuario,
      );

      resposta.redirect(
        `/cifra/criptografar?textoCifrado=${encodeURIComponent(
          resultado.textoCifrado,
        )}&hash=${encodeURIComponent(resultado.hash)}&mensagemOriginal=${encodeURIComponent(
          dto.mensagem,
        )}&deslocamento=${encodeURIComponent(dto.deslocamento.toString())}`,
      );
    } catch (error) {
      const mensagem = this.resolverMensagemErro(error);
      const parametros = new URLSearchParams();
      parametros.append('erro', mensagem);
      if (dto.mensagem) {
        parametros.append('mensagemOriginal', dto.mensagem);
      }
      if (typeof dto.deslocamento !== 'undefined' && dto.deslocamento !== null) {
        parametros.append('deslocamento', dto.deslocamento.toString());
      }
      resposta.redirect(`/cifra/criptografar?${parametros.toString()}`);
    }
  }

  @Get('decifrar')
  @UseGuards(JwtAuthGuard)
  @Render('cifra/decifrar')
  mostrarFormularioDecifragem(
    @UsuarioAtual() usuario: Usuario,
    @Query('textoCifrado') textoCifrado?: string,
    @Query('textoPlano') textoPlano?: string,
    @Query('hash') hash?: string,
    @Query('erro') erro?: string,
    @Query('sucesso') sucesso?: string,
  ) {
    return {
      usuario,
      textoCifrado,
      textoPlano,
      hash,
      erro,
      sucesso,
    };
  }

  @Post('decifrar')
  @UseGuards(JwtAuthGuard)
  async decifrar(@Body() dto: DecifrarDto, @Res() resposta: Response) {
    try {
      const textoPlano = await this.cifraService.decifrar(dto.textoCifrado, dto.hash);

      resposta.redirect(
        `/cifra/decifrar?textoPlano=${encodeURIComponent(
          textoPlano,
        )}&hash=${encodeURIComponent(dto.hash)}`,
      );
    } catch (error) {
      const mensagem = this.resolverMensagemErro(error);
      const parametros = new URLSearchParams();
      parametros.append('erro', mensagem);
      if (dto.textoCifrado) {
        parametros.append('textoCifrado', dto.textoCifrado);
      }
      if (dto.hash) {
        parametros.append('hash', dto.hash);
      }
      resposta.redirect(`/cifra/decifrar?${parametros.toString()}`);
    }
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
