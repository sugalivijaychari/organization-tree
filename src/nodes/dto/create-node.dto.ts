import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateNodeDto {
  @IsString()
  nodeName: string;

  @IsString()
  nodeType: string;

  @IsNumber()
  @IsOptional()
  parentId?: number;
}
