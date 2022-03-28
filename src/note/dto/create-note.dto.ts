import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  color: string

  @IsBoolean()
  @IsNotEmpty()
  completed: boolean
}