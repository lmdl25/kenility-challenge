import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true, required: true })
  username: string

  @Prop({ required: true })
  password: string

  @Prop()
  token?: string

  @Prop({ type: Date, default: null })
  deletedAt?: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
