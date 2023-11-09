
import { Module } from '@nestjs/common';
import { SlackModule } from './slack/slack.module';
import { IntegrationFactory } from './factory/integration.factory';
import { AuthModule } from 'src/auth/auth.module';
import { IntegrationService } from './integrations.service';
import { RestApiModule } from './rest-api/rest-api.module';
import { JwtModule } from '@nestjs/jwt';



@Module({
  imports: [SlackModule,AuthModule, RestApiModule,],
  providers:[IntegrationService]
})
export class IntegrationModule { }
