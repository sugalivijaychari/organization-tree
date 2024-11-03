import { IsNumber } from 'class-validator';

export class UpdateNodeDto {
  @IsNumber()
  parentId: number;
}
