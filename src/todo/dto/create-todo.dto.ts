import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  category_id: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  status?: 1 | 2 | 3;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  label?: 1 | 2 | 3;
}

export class UpdateTaskDto extends CreateTodoDto {}
