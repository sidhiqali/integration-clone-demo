import { Injectable } from '@nestjs/common';
import { BearerService } from 'src/auth/bearer.service.ts.service';
import { BasicService } from 'src/auth/basicAuth.service';
import { OAuth2Service } from 'src/auth/oauth2.service';

@Injectable()
export class IntegrationFactory {
  constructor(
    private readonly oauth2Service: OAuth2Service,
    private readonly bearerService: BearerService,
    private readonly basicService: BasicService,
  ) {}

  async createIntegrationService(authType: string, payload: any) {
    switch (authType) {
      case 'oauth2':
        const authUrl = await this.oauth2Service.getAuthUrl(payload);
        return authUrl;
      case 'bearer':
        const result = await this.bearerService.verifyToken(payload);
        return result;
      case 'basic':
        const isAuthorized = await this.basicService.decodeBasicAuth(payload);
        console.log(isAuthorized,'tt')
        return isAuthorized;
      default:
        throw new Error(`AuthType '${authType}' not supported.`);
    }
  }
}
