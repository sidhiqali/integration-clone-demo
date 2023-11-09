import { Module } from '@nestjs/common';
import { RestApiController } from './rest-api.controller';
import { RestApiService } from './rest-api.service';
import { BearerService } from 'src/auth/bearer.service.ts.service';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { IntegrationFactory } from '../factory/integration.factory';
import { AuthModule } from 'src/auth/auth.module';
import { IntegrationService } from '../integrations.service';

@Module({
  imports: [JwtModule.register({}), HttpModule, AuthModule],
  controllers: [RestApiController],
  providers: [RestApiService, BearerService, IntegrationFactory,IntegrationService],
})
export class RestApiModule {}
