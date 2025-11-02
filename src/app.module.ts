import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { CifraModule } from './cifra/cifra.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL')?.trim();

        if (!databaseUrl) {
          throw new Error(
            'DATABASE_URL nao foi configurada. Defina no arquivo .env.',
          );
        }

        if (
          databaseUrl.includes('usuario') ||
          databaseUrl.includes('senha') ||
          databaseUrl.includes('@host')
        ) {
          throw new Error(
            'DATABASE_URL contem valores de exemplo. Substitua usuario/senha/host pelos dados reais.',
          );
        }

        const databaseSsl = (
          configService.get<string>('DATABASE_SSL', 'true') ?? 'true'
        ).toLowerCase();
        const useSsl =
          databaseSsl === 'true' || databaseSsl === '1' || databaseSsl === 'on';

        const rejectUnauthorized = (
          configService.get<string>(
            'DATABASE_SSL_REJECT_UNAUTHORIZED',
            'false',
          ) ??
          'false'
        ).toLowerCase();
        const sslRejectUnauthorized =
          rejectUnauthorized === 'true' ||
          rejectUnauthorized === '1' ||
          rejectUnauthorized === 'on';

        return {
          type: 'postgres',
          url: databaseUrl,
          autoLoadEntities: true,
          synchronize: true,
          ssl: useSsl
            ? {
                rejectUnauthorized: sslRejectUnauthorized,
              }
            : undefined,
        };
      },
    }),
    UsuariosModule,
    AuthModule,
    CifraModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
