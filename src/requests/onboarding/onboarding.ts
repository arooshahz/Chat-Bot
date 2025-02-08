import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OnboardingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Birthdate in ISO 8601 format',
    example: '1990-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  birthdate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt({ each: true })
  categories: number[];

  @ApiProperty()
  @IsNotEmpty()
  @IsInt({ each: true })
  interests: number[];
}
