// rest-api.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsOptional,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  value: string;

  @ApiProperty({ example: 'GET' })
  @IsNotEmpty()
  @IsString()
  label: string;
}

export class HttpRequestHeaderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  value: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  header: string;
}

export class SendRequestDto {
  @ApiProperty()
  @IsObject()
  httpMethod: HttpRequestDto;

  @ApiProperty({ example: 'https://jsonplaceholder.typicode.com/posts' })
  @IsString()
  httpUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  authUserName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  authPassword: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  requestBody: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => HttpRequestHeaderDto)
  requestHeaders: HttpRequestHeaderDto[];
}
