import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateLoginDto } from './dto/create-login.dto';

type SignInData = { userId: string; userName: string }
type AuthResult = { accessToken: string; userId: string; userName: string };
type PublicUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
    private readonly saltRounds = 10;
    constructor(
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
                if (e.code === 'P2002') throw new BadRequestException('This email or username is already registered. Please log in instead.');
            }
            if (e instanceof Prisma.PrismaClientValidationError) {
                throw new BadRequestException('Invalid user payload (missing or wrong field types).');
            }
            throw new InternalServerErrorException('Failed to create user');
        }
    }


    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    async authenticate(input: CreateLoginDto): Promise<AuthResult> {
        const user = await this.validateUser(input);
        return this.signIn(user);
    }

    async validateUser(input: CreateLoginDto): Promise<SignInData> {
        let user: User | null = null;
        try {
            user = await this.databaseService.user.findUnique({
                where: { userName: input.userName }
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientValidationError) {
                throw new BadRequestException('Invalid login payload.');
            }
            throw new InternalServerErrorException('Failed to validate credentials.');
        }

        const passwordValid = user && await this.comparePassword(input.password, user.password);
        if (!user || !passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            userId: user.userId,
            userName: user.userName
        };
    }

    async signIn(user: SignInData): Promise<AuthResult> {
        const tokenPayload = {
            sub: user.userId,
            userName: user.userName
        };
        const accessToken = await this.jwtService.signAsync(tokenPayload);

        return {
            accessToken,
            userName: user.userName,
            userId: user.userId
        };
    }

    async userDetails(userId: string, userName: string): Promise<PublicUser|null> {
        try {
            const userInfo = await this.databaseService.user.findUnique({
                where: {
                    userId: userId,
                    userName: userName
                }
            })
            if(userInfo){
                 const { password, ...userInfoData} = userInfo;
                 return userInfoData;
            }
            return null;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientValidationError) {
                throw new BadRequestException('Invalid login payload.');
            }
            throw new InternalServerErrorException('Failed to validate credentials.');
        }
    }
}
