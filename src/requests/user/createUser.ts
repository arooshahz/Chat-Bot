import {
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
  Length,
  IsDateString, IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  profilePicAttachmentId?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  profileBannerAttachmentId?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({
    description: 'Birthdate in ISO 8601 format',
    example: '1990-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  birthdate: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bio?: string;
}
