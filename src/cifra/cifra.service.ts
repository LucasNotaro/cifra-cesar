import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { ChaveCesar } from './chave-cesar.entity';

const ALFABETO = 'abcdefghijklmnopqrstuvwxyz0123456789';

@Injectable()
export class CifraService {
  constructor(
    @InjectRepository(ChaveCesar)
    private readonly repositorioChavesCesar: Repository<ChaveCesar>,
  ) {}

  async criptografar(
    mensagem: string,
    deslocamento: number,
    proprietario: Usuario,
  ) {
    const mensagemNormalizada = mensagem.toLowerCase();
    const mensagemCifrada = this.aplicarCifra(mensagemNormalizada, deslocamento);
    const hash = await this.gerarHashUnico();

    const chave = this.repositorioChavesCesar.create({
      hash,
      deslocamento,
      mensagemCifrada,
      proprietario,
    });

    await this.repositorioChavesCesar.save(chave);

    return {
      textoCifrado: mensagemCifrada,
      hash,
    };
  }

  async decifrar(textoCifrado: string, hash: string) {
    const registro = await this.repositorioChavesCesar.findOne({
      where: { hash },
      relations: ['proprietario'],
    });

    if (!registro) {
      throw new BadRequestException('Hash invalido ou inexistente.');
    }

    if (registro.utilizada) {
      throw new BadRequestException('Este hash ja foi utilizado.');
    }

    if (registro.mensagemCifrada !== textoCifrado.toLowerCase()) {
      throw new BadRequestException(
        'A mensagem criptografada nao corresponde ao hash informado.',
      );
    }

    const textoPlano = this.aplicarCifra(
      textoCifrado.toLowerCase(),
      -registro.deslocamento,
    );

    registro.utilizada = true;
    await this.repositorioChavesCesar.save(registro);

    return textoPlano;
  }

  private async gerarHashUnico(tamanho = 16): Promise<string> {
    let hash: string;

    do {
      hash = this.gerarAlfanumericoAleatorio(tamanho);
    } while (
      await this.repositorioChavesCesar.exists({
        where: { hash },
      })
    );

    return hash;
  }

  private gerarAlfanumericoAleatorio(tamanho: number): string {
    const bytes = randomBytes(tamanho);
    const caracteres: string[] = [];
    for (let i = 0; i < tamanho; i++) {
      const indice = bytes[i] % ALFABETO.length;
      caracteres.push(ALFABETO[indice]);
    }
    return caracteres.join('');
  }

  private aplicarCifra(mensagem: string, deslocamento: number): string {
    const deslocamentoNormalizado =
      ((deslocamento % ALFABETO.length) + ALFABETO.length) % ALFABETO.length;

    return Array.from(mensagem)
      .map((caractere) => this.deslocarCaractere(caractere, deslocamentoNormalizado))
      .join('');
  }

  private deslocarCaractere(caractere: string, deslocamento: number): string {
    const caractereMinusculo = caractere.toLowerCase();
    const indice = ALFABETO.indexOf(caractereMinusculo);

    if (indice === -1) {
      return caractere;
    }

    const novoIndice = (indice + deslocamento) % ALFABETO.length;

    return ALFABETO[novoIndice];
  }
}
