import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { SlackIntegration } from './slack.service';
import { OAuth2Service } from 'src/auth/oauth2.service';
import { IntegrationService } from '../integrations.service';
import { OAuth2Options } from 'src/utils/interfaces';
import { ConfigService } from '@nestjs/config';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { config } from 'yargs';
import { SlackChannel, SlackUser } from './dto/response/slack.dto';
import { MessageDto } from './dto/request/slackReq.dto';

@ApiTags('slack')
@Controller('slack')
export class SlackController {
  constructor(
    private readonly configService: ConfigService,
    private readonly slackIntegration: SlackIntegration,
    private readonly OauthService: OAuth2Service,
    private readonly Integrationservice: IntegrationService,
  ) {}

  private config: OAuth2Options = {
    integrationName: 'slack',
    clientID: this.configService.get<string>('SLACK_CLIENT_ID'),
    clientSecret: this.configService.get<string>('SLACK_CLIENT_SECRET'),
    authorizationURL: 'https://slack.com/oauth/v2/authorize',
    tokenURL: 'https://slack.com/api/oauth.v2.access',
    callbackURL: 'https://8288-202-164-149-56.ngrok-free.app/slack/callback',
    scope:
      'channels:join,channels:manage,channels:read,chat:write,chat:write.customize,chat:write.public,users:read,groups:history,groups:write,groups:read,mpim:write&user_scope=channels:read,channels:write,users.profile:read,users:read,channels:history,chat:write,groups:read,reactions:read,mpim:read,usergroups:read',
  };
  @ApiOAuth2([
    'channels:join,channels:manage,channels:read,chat:write,chat:write.customize,chat:write.public,users:read,groups:history,groups:write,groups:read,mpim:write&user_scope=channels:read,channels:write,users.profile:read,users:read,channels:history,chat:write,groups:read,reactions:read,mpim:read,usergroups:read',
  ])
  @Get('oauth2')
  @ApiOkResponse({
    description: 'retun authUrl',
    type: String,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async initiateOAuth2() {
    const authUrl = await this.slackIntegration.authenticate(
      'oauth2',
      this.config,
    );
    return { authUrl };
  }

  @Get('callback')
  @ApiOkResponse({
    description: 'retun accestoken',
    type: String,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async callback(@Query('code') code: string) {
    const accessToken = await this.OauthService.getAccessToken(code);
    console.log(accessToken);
    this.Integrationservice.storeAccessToken('slack', accessToken);
    return { accessToken };
  }

  @Get('slack-users')
  @ApiOkResponse({
    description: 'retun accestoken',
    type: SlackUser,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getSlackUsers() {
    const isAuthenticated = await this.slackIntegration.isaAuthenticate();
    if (!isAuthenticated) {
      return { message: 'Not authenticated. Please connect to Slack first.' };
    }

    const users = await this.slackIntegration.performAction('listUsers', {});
    return { users };
  }

  @Get('slack-channels')
  @ApiOkResponse({
    description: 'channel datas',
    type: SlackChannel,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getSlackChannels() {
    const isAuthenticated = await this.slackIntegration.isaAuthenticate();
    if (!isAuthenticated) {
      return { message: 'Not authenticated. Please connect to Slack first.' };
    }

    const channels = await this.slackIntegration.performAction(
      'listChannels',
      {},
    );
    return { channels };
  }

  @Post('send-message')
  @ApiCreatedResponse({
    description: 'Message sent successfully',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async sendMessage(
    @Body()
    message: MessageDto,
  ) {
    const isAuthenticated = await this.slackIntegration.isaAuthenticate();

    if (!isAuthenticated) {
      return { message: 'Not authenticated. Please connect to Slack first.' };
    }

    const result = await this.slackIntegration.performAction(
      'sendMessage',
      message,
    );
    return result;
  }
}
