import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  recipientType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  recipientId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;
}
