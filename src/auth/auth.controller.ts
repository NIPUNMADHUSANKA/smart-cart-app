import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateLoginDto } from './dto/create-login.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body(new ValidationPipe) input: CreateLoginDto){
        return this.authService.authenticate(input);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    register(
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

    @UseGuards(AuthGuard)
    @Get('info')
    getUserDetails(@Request() request){
        return this.authService.userDetails(request.user.userId, request.user.userName);
    }
}
