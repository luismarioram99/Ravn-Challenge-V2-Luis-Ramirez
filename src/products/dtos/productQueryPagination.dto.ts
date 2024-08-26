import { IsOptional, IsString } from 'class-validator';
import { QueryPaginationDto } from '../../commons/queryPagination.dto';

export class ProductQueryPaginationDto extends QueryPaginationDto {
  @IsString()
  @IsOptional()
  category?: string;
}
