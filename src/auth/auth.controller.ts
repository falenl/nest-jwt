import { Request, Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthUserDto } from 'src/dto/AuthUserDto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post("register")
    async register(@Body() user: AuthUserDto){
        return this.authService.createUser(user);
    }

    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Request() req){
        return this.authService.login(req.user);
    }
}
