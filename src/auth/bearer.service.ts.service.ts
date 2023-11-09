import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BearerService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async verifyToken(token: string): Promise<boolean> {
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const decodedToken = this.jwtService.verify(token, { secret: jwtSecret });
      console.log(decodedToken);
      return true;
    } catch (error) {
      return false;
    }
  }
}
