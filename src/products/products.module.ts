import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'

import { ProductsController } from './products.controller'
import { MinioServiceModule } from '../minio/minio.module'
import { ProductSchema } from './entities/product.schema'
import { AuthModule } from '../auth/jwt.guard.module'
import { ProductsService } from './products.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    AuthModule,
    MinioServiceModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, MinioServiceModule, AuthModule],
  exports: [ProductsService],
})
export class ProductsModule {}
