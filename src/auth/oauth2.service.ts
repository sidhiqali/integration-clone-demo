// oauth2.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OAuth2Options } from 'src/utils/interfaces';

@Injectable()
export class OAuth2Service {
  private config: OAuth2Options;

  async getAuthUrl(config: OAuth2Options): Promise<string> {
    this.config = config;
    return `${config.authorizationURL}?client_id=${config.clientID}&response_type=${config?.response_type}&scope=${config.scope}&redirect_uri=${config.callbackURL}`;
  }

  async getAccessToken(code: string): Promise<string> {
    try {
      console.log(this.config.tokenURL);
      const response = await axios.post(this.config.tokenURL, null, {
        params: {
          client_id: this.config.clientID,
          client_secret: this.config.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.config.callbackURL,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      });
      console.log(response.data);
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }
}
