import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ItemfileDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsDate()
  @IsNotEmpty()
  public created: Date;

  @IsString()
  public path: string;

  @IsDate()
  @IsNotEmpty()
  public modify: Date;

  @IsBoolean()
  public deleted: boolean;

  @IsString()
  @IsNotEmpty()
  public owner: string;

  @IsString()
  @IsOptional()
  public uuid?: string;

  @IsString()
  @IsOptional()
  public _id?: string;

  @IsNumber()
  @IsNotEmpty()
  public timestamp: number;
}
