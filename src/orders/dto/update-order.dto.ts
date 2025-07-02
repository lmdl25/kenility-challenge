import {
  ValidateNested,
  IsNotEmpty,
  MinLength,
  IsString,
  IsArray,
} from 'class-validator'
import { PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'

import { CreateOrderProductItemDto } from './create-order.dto'
import { OrderDocs } from '../documentation/order.docs'

export class UpdateOrderDto extends PartialType(OrderDocs) {
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
