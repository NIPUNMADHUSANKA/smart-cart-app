import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import "dotenv/config";
import { PassportModule } from '@nestjs/passport';
import { PassportAuthController } from './passport-auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController, PassportAuthController],
  imports: [UserModule, DatabaseModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '1d'},
    })
  ],
})
export class AuthModule {}
