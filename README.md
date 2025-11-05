# Cifra de Cesar

Aplicacao NestJS para praticar a cifra de Cesar com autenticacao via JWT e interface em EJS.

## Configuracao do projeto

1. Copie o arquivo `.env.exemplo` para `.env` e preencha com as informacoes do banco e JWT.
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

## Fluxo principal

1. Acesse `/auth/login` para entrar.
2. Caso nao possua conta, utilize `/auth/cadastro`.
3. Depois do login, o menu principal apresenta os atalhos para `/cifra/criptografar` e `/cifra/decifrar`.

## Estrutura

- `src/usuarios`: modulo de usuarios, contendo entidade, servico e modulo NestJS.
- `src/cifra`: recursos relacionados a cifra de Cesar.
- `views`: paginas EJS utilizadas pela aplicacao.
