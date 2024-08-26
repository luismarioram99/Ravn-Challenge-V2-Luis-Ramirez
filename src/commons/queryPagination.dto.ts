import { IsNumberString, IsOptional } from 'class-validator';

export class QueryPaginationDto {
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsNumberString()
  offset?: number;
}
