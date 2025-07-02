import { Product } from '@/src/products/entities/product.schema'
import mongoose, { HydratedDocument, Document } from 'mongoose'
import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose'

@Schema({ _id: false })
export class OrderProductListItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  productId: string

  @Prop({ required: true, min: 1 })
  quantity: number

  @Prop({ required: true, min: 0 })
  pricePerUnit: number
}

export const OrderProductListItemSchema =
  SchemaFactory.createForClass(OrderProductListItem)

export type OrderDocument = HydratedDocument<Order>

@Schema({ timestamps: true })
export class Order extends Document<number> {
  @Prop({ required: true, trim: true })
  clientName: string

  @Prop({ required: true, min: 0 })
  total: number

  @Prop({
    type: [OrderProductListItemSchema],
    required: true,
    validate: (v: unknown) => Array.isArray(v) && v.length > 0,
  })
  productList: OrderProductListItem[]

  createdAt?: Date
  updatedAt?: Date
}

export const OrderSchema = SchemaFactory.createForClass(Order)

OrderSchema.index({ createdAt: -1 })
OrderSchema.index({ total: -1 })
OrderSchema.index({ clientName: 1 })
OrderSchema.index({ status: 1 })
