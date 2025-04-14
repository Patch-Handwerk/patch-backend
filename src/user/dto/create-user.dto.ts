import {IsEmail, isNotEmpty, IsNotEmpty, isString, IsString } from "class-validator";

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password:string;

    @IsNotEmpty()
    role: string;
}