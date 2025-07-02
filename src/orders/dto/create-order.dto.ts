import {
  ValidateNested,
  IsNotEmpty,
  IsPositive,
  IsMongoId,
  MinLength,
  IsNumber,
  IsString,
  IsArray,
} from 'class-validator'
import { PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'

import { OrderDocs } from '../documentation/order.docs'

export class CreateOrderProductItemDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: string

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number
}

export class CreateOrderDto extends PartialType(OrderDocs) {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  clientName: string

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductItemDto)
  productList: CreateOrderProductItemDto[]
}
