import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackIntegration } from './slack.service';
import { OAuth2Service } from 'src/auth/oauth2.service';
import { IntegrationFactory } from '../factory/integration.factory';
import { BearerService } from 'src/auth/bearer.service.ts.service';
import { BasicService } from 'src/auth/basicAuth.service';
import { IntegrationService } from '../integrations.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [SlackController],
  providers: [
    SlackIntegration,
    OAuth2Service,
    IntegrationFactory,
    BearerService,
    BasicService,
    IntegrationService,
  ],
  exports: [SlackIntegration],
})
export class SlackModule {}
