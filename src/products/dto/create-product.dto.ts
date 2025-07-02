import {
  IsNotEmpty,
  IsPositive,
  MinLength,
  IsString,
  IsNumber,
} from 'class-validator'
import { OmitType } from '@nestjs/swagger'

import { ProductDocs } from '../documentation/create-product.request'

export class CreateProductDto extends OmitType(ProductDocs, [
  '_id',
  '__v',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'imageUrl',
]) {
  @IsNotEmpty({ message: 'Product name should not be empty.' })
  @IsString({ message: 'Product name must be a string.' })
  @MinLength(3, { message: 'Product name must be at least 3 characters long.' })
  name: string

  @IsNotEmpty({ message: 'Product SKU should not be empty.' })
  @IsString({ message: 'Product SKU must be a string.' })
  sku: string

  @IsNotEmpty({ message: 'Product price should not be empty.' })
  @IsNumber({}, { message: 'Product price must be a number.' })
  @IsPositive({ message: 'Product price must be a positive number.' })
  price: number
}
