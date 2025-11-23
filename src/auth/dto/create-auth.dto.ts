import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
} from "class-validator";

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  userName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
