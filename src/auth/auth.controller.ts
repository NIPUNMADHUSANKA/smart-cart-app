import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() input: {username: string; password: string}){
        return this.authService.authenticate(input);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(
        @Body(new ValidationPipe)
        createAuthDto: CreateAuthDto
    ){
        return this.authService.registerUser(createAuthDto);
    }

    @UseGuards(AuthGuard)
    @Get('me')
    getUserInfo(@Request() request){
        return request.user;
    }

}
