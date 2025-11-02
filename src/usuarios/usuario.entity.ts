import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChaveCesar } from '../cifra/chave-cesar.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nomeUsuario: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  hashSenha: string;

  @OneToMany(() => ChaveCesar, (chave) => chave.proprietario)
  chaves: ChaveCesar[];

  @CreateDateColumn()
  criadoEm: Date;
}
