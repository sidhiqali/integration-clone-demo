import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IntegrationFactory } from '../factory/integration.factory';
import { Integration } from '../interface';
import { SendRequestDto } from './dto/request/api.dto';
import { firstValueFrom } from 'rxjs';
import { IntegrationService } from '../integrations.service';

@Injectable()
export class RestApiService implements Integration {
  constructor(
    private readonly httpService: HttpService,
    private readonly integrationFactory: IntegrationFactory,
    private readonly integrationService: IntegrationService,
  ) {}

  async authenticate(
    authType: string,
    payload: any,
  ): Promise<string | boolean> {
    const result: any = this.integrationFactory.createIntegrationService(
      authType,
      payload,
    );
    return result;
  }

  async performAction(
    actionName: string,
    payload: SendRequestDto,
  ): Promise<any> {
    switch (actionName) {
      case 'sendRequest':
        return this.sendRequest(payload);
    }
  }

  async sendRequest(sendRequestDto: SendRequestDto): Promise<any> {
    try {
      const config: AxiosRequestConfig = {
        method: sendRequestDto.httpMethod.label,
        url: sendRequestDto.httpUrl,
        headers: {},
        data: sendRequestDto.requestBody,
      };

      if (sendRequestDto.authUserName && sendRequestDto.authPassword) {
        const authorization = Buffer.from(
          `${sendRequestDto.authUserName}:${sendRequestDto.authPassword}`,
        ).toString('base64');
        config.headers['Authorization'] = `Basic ${authorization}`;
      }

      sendRequestDto.requestHeaders.forEach((header) => {
        console.log(header, 'header');
        config.headers[header.header] = header.value;
      });
      console.log(config);
      const result = await this.sendapiRequest(config);
      console.log(result, 'reskdljfslkdjflsdjflsdlfjsldkj');
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to send the request',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async isAuthenticate(): Promise<boolean> {
    const isAutherized =
      this.integrationService.getAuthorizationStatus('rest-api');
    const accessToken = this.integrationService.getAccessToken('rest-api');
    if (isAutherized || accessToken) {
      return true;
    }
    return false;
  }

  async sendapiRequest(config: AxiosRequestConfig): Promise<any> {
    try {
      const response$ = this.httpService.request(config);
      console.log(response$, 'ressss');
      const response: AxiosResponse<any, any> = await firstValueFrom(response$);
      console.log(response, 'sfs;');
      return response.data;
    } catch (error) {
      console.error('Error sending request:', error);
      throw error;
    }
  }
}
