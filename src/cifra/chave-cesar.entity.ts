import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('chaves_cesar')
@Unique(['hash'])
export class ChaveCesar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hash: string;

  @Column()
  deslocamento: number;

  @Column({ type: 'text' })
  mensagemCifrada: string;

  @Column({ default: false })
  utilizada: boolean;

  @CreateDateColumn()
  criadaEm: Date;

  @UpdateDateColumn()
  atualizadaEm: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.chaves, {
    eager: false,
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  proprietario: Usuario;
}
