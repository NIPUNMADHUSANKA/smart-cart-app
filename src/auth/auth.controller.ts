import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateLoginDto } from './dto/create-login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body(new ValidationPipe) input: CreateLoginDto) {
        return this.authService.authenticate(input);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    register(
        @Body(new ValidationPipe)
        createAuthDto: CreateAuthDto
    ) {
        return this.authService.registerUser(createAuthDto);
    }

    @UseGuards(AuthGuard)
    @Get('me')
    getUserInfo(@Request() request) {
        return request.user;
    }

    @UseGuards(AuthGuard)
    @Get('info')
    getUserDetails(@Request() request) {
        return this.authService.userDetails(request.user.userId, request.user.userName);
    }

    @UseGuards(AuthGuard)
    @Delete('remove')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteUser(@Request() request) {
        const userId = request.user.userId;
        this.authService.remove(userId);
    }

    @UseGuards(AuthGuard)
    @Patch('resetPassword')
    async resetPassword(@Request() request,
    @Body() { currentPassword, newPassword }: ResetPasswordDto
    ) {
        const userId = request.user.userId;
        return this.authService.resetPassword(userId, currentPassword, newPassword);
    }
}
