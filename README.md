# Cifra de Cesar

Aplicacao NestJS para praticar a cifra de Cesar com autenticacao via JWT e interface em EJS totalmente em portugues.

## Configuracao do projeto

1. Copie o arquivo `.env.example` para `.env` e preencha com as informacoes do banco e JWT.
2. Instale as dependencias:

```bash
npm install
```

## Executar

```bash
# desenvolvimento
npm run start:dev

# producao
npm run start:prod
```

## Comandos uteis

- `npm run build`: compila o projeto TypeScript.
- `npm run test`: executa os testes unitarios.
- `npm run test:e2e`: executa os testes end-to-end.

## Fluxo principal

1. Acesse `/auth/login` para entrar.
2. Caso nao possua conta, utilize `/auth/cadastro`.
3. Depois do login, o menu principal apresenta os atalhos para `/cifra/criptografar` e `/cifra/decifrar`.

## Estrutura

- `src/usuarios`: modulo de usuarios, contendo entidade, servico e modulo NestJS.
- `src/cifra`: recursos relacionados a cifra de Cesar.
- `views`: paginas EJS utilizadas pela aplicacao.

## Licenca

Projeto disponibilizado apenas para fins educacionais.
