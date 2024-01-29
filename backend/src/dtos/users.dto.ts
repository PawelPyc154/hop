import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class AuthUserDto {
  @IsString()
  public username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}
