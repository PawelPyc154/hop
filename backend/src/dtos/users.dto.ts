import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateUserDto {
  @IsEmail()
  public username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}
