import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import {Role} from '../../admin/enums/role.enum';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/, {message: "Password must contain atleast one number"})
    password: string;

    @IsEnum(Role)
    role: Role;

}