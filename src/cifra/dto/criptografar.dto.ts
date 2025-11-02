import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CriptografarDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  mensagem: string;

  @Type(() => Number)
  @IsInt()
  @Min(-1000)
  @Max(1000)
  deslocamento: number;
}
