import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  Query,
} from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { RestApiService } from './rest-api.service';
import { SendRequestDto } from './dto/request/api.dto';
import { Request } from 'express';
import { OAuth2Options } from 'src/utils/interfaces';
import { ConfigService } from '@nestjs/config';
import { OAuth2Service } from 'src/auth/oauth2.service';
import { IntegrationService } from '../integrations.service';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { string } from 'yargs';
import send from 'send';
import { type } from 'os';
import { resultDto } from './dto/response/apiRes.dto';

@ApiTags('RestApi')
@Controller('rest-api')
export class RestApiController {
  constructor(
    private readonly configService: ConfigService,
    private readonly restApiIntegrationService: RestApiService,
    private readonly oauthService: OAuth2Service,
    private readonly integrationService: IntegrationService,
  ) {}
  private config: OAuth2Options = {
    integrationName: 'rest-api',
    clientID: this.configService.get<string>('GOOGLE_CLIENT_ID'),
    clientSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
    authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenURL: 'https://oauth2.googleapis.com/token',
    callbackURL: 'http://localhost:3000/rest-api/callback',
    response_type: 'code',
    scope: 'email%20profile',
  };

  @ApiOAuth2(['email%20profile'])
  @Get('oauth2')
  @ApiOkResponse({
    description: 'return authurl',
    type: String,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async initiateOAuth2() {
    const authUrl = await this.restApiIntegrationService.authenticate(
      'oauth2',
      this.config,
    );
    return { authUrl };
  }
  @Get('callback')
  @ApiOkResponse({
    description: 'accesstoken',
    type: String,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async callback(@Query('code') code: string) {
    const accessToken = await this.oauthService.getAccessToken(code);
    console.log(accessToken);
    this.integrationService.storeAccessToken('rest-api', accessToken);
    return { accessToken };
  }

  @ApiBearerAuth()
  @Get('bearer')
  @ApiOkResponse({
    description: 'isAuthenticated',
    type: resultDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async initiateBearer(@Req() request: Request) {
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader) {
      return { message: 'Header is missing' };
    }
    const token = authorizationHeader.replace('Bearer', '');
    const result = await this.restApiIntegrationService.authenticate(
      'bearer',
      token,
    );
    console.log(result);
    this.integrationService.setAuthorizationStatus(
      'rest-api',
      result as boolean,
    );
    if (result) {
      return { message: 'Authorized', status: result };
    }
    return { message: 'Unauthorized' };
  }

  @ApiBasicAuth()
  @Get('basic')
  @ApiOkResponse({
    description: 'isAuthenticated',
    type: resultDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async initiateBasic(@Req() request: Request) {
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader) {
      return { message: 'Header is missing' };
    }
    const result = await this.restApiIntegrationService.authenticate(
      'basic',
      authorizationHeader,
    );

    this.integrationService.setAuthorizationStatus(
      'rest-api',
      result as boolean,
    );
    if (result) {
      return { message: 'Authorized', status: result };
    }
    return { message: 'Unauthorized' };
  }

  @Post('send-request')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'the request successfully sent',
    type: SendRequestDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async sendRequest(@Body() sendRequestDto: SendRequestDto): Promise<any> {
    const isAuthenticated =
      await this.restApiIntegrationService.isAuthenticate();
    if (!isAuthenticated) {
      return { message: 'Not authenticated. Please connect to RestApi first.' };
    }
    console.log(sendRequestDto);
    const result = await this.restApiIntegrationService.performAction(
      'sendRequest',
      sendRequestDto,
    );
    console.log(result);
    return result;
  }
}
