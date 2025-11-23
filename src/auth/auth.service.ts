import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

type AuthInput = { username: string; password: string }
type SignInData = { userId: string; username: string }
type AuthResult = { accessToken: string; userId: string; username: string };
type PublicUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
    private readonly saltRounds = 10;
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly databaseService: DatabaseService,
    ) { }

    async registerUser(input: CreateAuthDto): Promise<PublicUser> {
        const hashedPassword = await this.hashPassword(input.password);
        try {
            const user = await this.databaseService.user.create({
                data: {
                    fullName: input.fullName,
                    email: input.email,
                    userName: input.userName,
                    password: hashedPassword
                } as Prisma.UserCreateInput
            });
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') throw new BadRequestException('User already exists');
            }
            if (e instanceof Prisma.PrismaClientValidationError) {
                throw new BadRequestException('Invalid user payload (missing or wrong field types).');
            }
            throw new InternalServerErrorException('Failed to create user');
        }
    }


    async hashPassword(password: string): Promise<string>{
        return await bcrypt.hash(password, this.saltRounds);
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean>{
        return await bcrypt.compare(password, hashedPassword);
    }

    async authenticate(input: AuthInput): Promise<AuthResult> {
        const user = await this.validateUser(input);

        if(!user){
            throw new UnauthorizedException();
        }

        return this.signIn(user);
    }

    async validateUser(input: AuthInput): Promise<SignInData | null> {
        const user = await this.userService.findUserByName(input.username);

        if (user && user.password === input.password) {
            return {
                userId: user.userId,
                username: user.username
            };
        };

        return null;
    }

    async signIn(user: SignInData): Promise<AuthResult>{
        const tokenPayload = {
            sub: user.userId,
            username: user.username
        };
        const accessToken = await this.jwtService.signAsync(tokenPayload);

        return {
            accessToken,
            username: user.username,
            userId: user.userId
        };
    }
}
