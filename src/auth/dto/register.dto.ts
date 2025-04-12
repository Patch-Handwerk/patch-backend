import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import {Role} from '../../user/role.enum';

export class RegisterDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsEnum(Role)
    role: Role;

}