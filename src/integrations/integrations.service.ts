
import { Injectable} from '@nestjs/common';
@Injectable()
export class IntegrationService {
  private accessTokens = new Map<string, string>();
  private authorizedStatus = new Map<string, Promise<boolean>>();

  storeAccessToken(integrationName: string, accessToken: string): void {
    this.accessTokens.set(integrationName, accessToken);
  }

  getAccessToken(integrationName: string): string | undefined {
    return this.accessTokens.get(integrationName);
  }

  setAuthorizationStatus(integrationName: string, status: boolean): void {
    this.authorizedStatus.set(integrationName, Promise.resolve(status));
  }

  getAuthorizationStatus(integrationName: string): Promise<boolean> | undefined {
    return this.authorizedStatus.get(integrationName);
  }
}
