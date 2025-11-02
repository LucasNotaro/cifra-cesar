import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ChaveCesar } from './chave-cesar.entity';
import { CifraController } from './cifra.controller';
import { CifraService } from './cifra.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChaveCesar]), AuthModule],
  providers: [CifraService],
  controllers: [CifraController],
})
export class CifraModule {}
