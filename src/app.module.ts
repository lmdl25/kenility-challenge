import { Module } from '@nestjs/common'

import { HealthCheckController } from './health-check/health-check.controller'
import { ResponseNormalizerModule } from './interceptors/normalizer.module'
import { HealthCheckModule } from './health-check/health-check.module'
import { MongooseConfigModule } from './database/mongoose.module'
import { UsersControllerModule } from './users/users.module'
import { ProductsModule } from './products/products.module'
import { OrdersModule } from './orders/orders.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ResponseNormalizerModule,
    MongooseConfigModule,
    HealthCheckModule,
    UsersControllerModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [AppController, HealthCheckController],
  providers: [AppService],
})
export class AppModule {}
