import { IsDateString, IsOptional, IsString } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  // @ApiProperty()
  @IsString()
  @IsOptional()
  fullName?: string;

  // @ApiProperty({
  //   description: 'Birthdate in ISO 8601 format',
  //   example: '1990-01-01T00:00:00.000Z',
  // })
  @IsDateString()
  @IsOptional()
  birthdate?: string;
}
