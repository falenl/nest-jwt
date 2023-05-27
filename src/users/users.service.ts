import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UsersService {
    private readonly bcryptRound: number;
    constructor(private prismaService: PrismaService){
        this.bcryptRound = parseInt(process.env['BCRYPT_SALT_ROUND']);
    }

    async findOne(username: string): Promise<any | undefined> {
        return this.prismaService.user.findFirst(
            {
                where: {
                    username
                }
            }
        );
    }

    async create(username: string, password: string): Promise<any>{
        const hashed = bcrypt.hashSync(password, this.bcryptRound);
        try {
            return await this.prismaService.user.create({
              data: {
                username: username,
                password: hashed,
              },
            });
          } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
              if (error.code === 'P2002') {
                throw new ForbiddenException('Email is invalid or already taken');
              }
            }
            throw error;
          }
    }
}
