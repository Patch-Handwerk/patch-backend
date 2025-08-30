import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        description: 'Email address used for login',
        example: 'john.doe@example.com',
        format: 'email'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User password for authentication',
        example: 'SecurePass123'
    })
    @IsNotEmpty()
    password: string;
}