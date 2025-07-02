import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'

import { ProductSchema, Product } from '../products/entities/product.schema'
import { OrderSchema, Order } from './schemas/order.schema'
import { OrdersController } from './orders.controller'
import { AuthModule } from '../auth/jwt.guard.module'
import { OrdersService } from './orders.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, AuthModule],
  exports: [OrdersService],
})
export class OrdersModule {}
