import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {Role} from '../../admin/enums/role.enum';

export class RegisterDto {
    @ApiProperty({
        description: 'Full name of the user',
        example: 'John Doe',
        minLength: 2,
        maxLength: 50
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Valid email address for the user account',
        example: 'john.doe@example.com',
        format: 'email'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password for the user account (minimum 6 characters, must contain at least one number)',
        example: 'SecurePass123',
        minLength: 6
    })
    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/, {message: "Password must contain atleast one number"})
    password: string;

    @ApiProperty({
        description: 'User role in the system',
        example: 'USER',
        enum: Role,
        enumName: 'Role'
    })
    @IsEnum(Role)
    role: Role;
}