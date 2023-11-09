import { Injectable } from '@nestjs/common';
import { basicAuth } from 'src/utils/interfaces';

@Injectable()
export class BasicService {
  private user: basicAuth = {
    username: 'admin',
    password: 'password',
  };

  async decodeBasicAuth(authorizationHeader: string): Promise<any> {
    const authType = authorizationHeader.split(' ')[0];
    const credentials = authorizationHeader.split(' ')[1];

    if (authType.toLowerCase() === 'basic') {
      const decodedCredentials = Buffer.from(credentials, 'base64').toString(
        'utf-8',
      );
      const credentialArray = decodedCredentials.split(':');
      const credential = {
        username: credentialArray[0],
        password: credentialArray[1],
      };
      console.log(credential);
      const isAuthorized = await this.verifyBasicCredentials(credential);
      console.log(isAuthorized,'is');
      return isAuthorized;
    }
  }

  async verifyBasicCredentials(credential: basicAuth): Promise<boolean> {
    console.log(credential);
    if (
      credential.username === this.user.username &&
      credential.password === this.user.password
    ) {
      return true;
    }
    return false;
  }
}
