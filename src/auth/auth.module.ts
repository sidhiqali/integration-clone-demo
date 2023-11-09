import { Module } from '@nestjs/common';
import { OAuth2Service } from './oauth2.service';
import { BasicService } from './basicAuth.service';
import { JwtModule } from '@nestjs/jwt';
import { BearerService } from './bearer.service.ts.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [OAuth2Service, BearerService, BasicService],
  exports: [OAuth2Service, BearerService, BasicService],
})
export class AuthModule {}
