import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthUserDto } from 'src/dto/AuthUserDto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
        ){

        }

    async validateUser(username: string, pass: string): Promise<any>{
        const user = await this.usersService.findOne(username);
        if (!user){
            throw new UnauthorizedException();
        }
    
        const isMatched = bcrypt.compareSync(pass, user.password);
        if (!isMatched){
            throw new UnauthorizedException();
        }

        const { password, ...result} = user;
        //TODO: generate JWT
        return result;
    }

    async createUser(user: AuthUserDto){
        return this.usersService.create(user.username, user.password);
    }

    async login(user: any){
        const payload = {username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
