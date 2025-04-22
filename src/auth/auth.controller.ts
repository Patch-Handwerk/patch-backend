import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService){}

    @ApiOperation({summary:'Register a new user'})
    @ApiResponse({status:201, description:'User registered successfully.'})
    @Post('register')
     async register(@Body() dto:RegisterDto){
        return this.authService.register(dto);
    }

    @ApiOperation({summary:'Login a user'})
    @ApiResponse({status:200, description:'Login registered successfully.'})
    @Post('login')
    async login(@Body() dto:LoginDto){
        return this.authService.login(dto);
    }
}
