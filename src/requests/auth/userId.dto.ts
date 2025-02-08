import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserIdDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
