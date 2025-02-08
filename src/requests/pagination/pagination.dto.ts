import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @ApiProperty()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  @Type(() => Number)
  limit?: number;
}
