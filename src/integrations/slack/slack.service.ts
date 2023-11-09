import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Integration } from '../interface';
import { ConfigService } from '@nestjs/config';
import { IntegrationFactory } from '../factory/integration.factory';
import { IntegrationService } from '../integrations.service';
import { OAuth2Options } from 'src/utils/interfaces';

@Injectable()
export class SlackIntegration implements Integration {
  constructor(
    private readonly integrationFactory: IntegrationFactory,
    private readonly integrationService: IntegrationService,
  ) {}
  private accessToken: string = '';

  async authenticate(authType: string, payload: any): Promise<string> {
    const authUrl: any = this.integrationFactory.createIntegrationService(
      authType,
      payload,
    );

    return authUrl;
  }

  async performAction(actionName: string, payload: any): Promise<any> {
    switch (actionName) {
      case 'listUsers':
        return this.getSlackUsers();

      case 'listChannels':
        return this.getSlackChannels();

      case 'sendMessage':
        return this.sendMessage(payload);
    }
  }

  async isaAuthenticate(): Promise<boolean> {
    const token = await this.integrationService.getAccessToken('slack');
    this.accessToken = token;
    if (token) {
      return true;
    }
    return false;
  }

  async getSlackUsers(): Promise<any[]> {
    const response: AxiosResponse = await axios.get(
      'https://slack.com/api/users.list',
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      },
    );
    return response.data.members;
  }

  async getSlackChannels(): Promise<any[]> {
    const response: AxiosResponse = await axios.get(
      'https://slack.com/api/conversations.list?types=public_channel,private_channel&limit=1000',
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      },
    );
    return response.data.channels;
  }

  async sendMessage(message: {
    recipientType: string;
    recipientId: string;
    text: string;
  }): Promise<any> {
    const { recipientType, recipientId, text } = message;
    const payload: any = { text };

    if (recipientType === 'user') {
      payload.channel = recipientId;
    } else if (recipientType === 'channel') {
      payload.channel = recipientId;
    }
    try {
      const response: AxiosResponse = await axios.post(
        'https://slack.com/api/chat.postMessage',
        payload,
        { headers: { Authorization: `Bearer ${this.accessToken}` } },
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
