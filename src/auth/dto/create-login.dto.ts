import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateLoginDto {

    @IsString()
    @IsNotEmpty()
    username!: string

    @IsString()
    @MinLength(6)
    password!: string;
}