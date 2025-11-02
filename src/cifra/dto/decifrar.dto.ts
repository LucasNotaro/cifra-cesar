import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class DecifrarDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  textoCifrado: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  hash: string;
}
