import { IsOptional, IsString } from 'class-validator';
import { QueryPaginationDto } from 'src/commons/queryPagination.dto';

export class ProductQueryPaginationDto extends QueryPaginationDto {
  @IsString()
  @IsOptional()
  category?: string;
}
