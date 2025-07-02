import { BaseDocs } from '@/src/swagger/base-docs'
import { ApiProperty } from '@nestjs/swagger'

import { CreateOrderProductItemDto } from '../dto/create-order.dto'

export class OrderDocs extends BaseDocs {
  @ApiProperty({
    description: "The order's client's name",
    example: '605c72ef1a33a9a3e8a5b4c8',
    type: String,
  })
  clientName: string

  @ApiProperty({
    description: 'The list of the products being ordered',
    example: [{ productId: '283472398432', quantity: 2 }],
    type: Array<CreateOrderProductItemDto>,
  })
  productList: CreateOrderProductItemDto[]
}
