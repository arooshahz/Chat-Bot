import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OTPDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
