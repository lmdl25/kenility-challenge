import { BaseDocs } from '@/src/swagger/base-docs'
import { ApiProperty } from '@nestjs/swagger'

export class ProductDocs extends BaseDocs {
  @ApiProperty({
    description: 'The name of the product (must be at least 3 characters)',
    example: 'Wireless Mouse Pro',
    type: String,
    minLength: 3,
  })
  name: string

  @ApiProperty({
    description: 'The unique Stock Keeping Unit (SKU) for the product',
    example: 'WMP-BLK-01',
    type: String,
  })
  sku: string

  @ApiProperty({
    description: 'The price of the product (must be a positive number)',
    example: 49.95,
    type: Number,
    minimum: 0.01,
  })
  price: number

  @ApiProperty({
    description: 'URL of the product image hosted on MinIO',
    example:
      'http://localhost:9000/product-images/WMP-BLK-02/image-1678886400000.jpg',
    type: String,
    required: false,
    nullable: true,
  })
  imageUrl: string
}
