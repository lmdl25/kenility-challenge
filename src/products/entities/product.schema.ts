import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose'
import { HydratedDocument, Document } from 'mongoose'

@Schema({ timestamps: true })
export class Product extends Document<number> {
  @Prop({ required: true })
  name: string

  @Prop({ unique: true, required: true })
  sku: string

  @Prop({ type: String, required: false, default: null })
  imageUrl?: string | null

  @Prop({ required: true })
  price: number

  @Prop({ type: Date, default: null })
  deletedAt?: Date
}

export type ProductDocument = HydratedDocument<Product>

export const ProductSchema = SchemaFactory.createForClass(Product)
