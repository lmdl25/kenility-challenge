import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'

import { HealthCheckController } from './health-check.controller'
import { HealthCheckService } from './health-check.service'

@Module({
  imports: [MongooseModule],
  controllers: [HealthCheckController],
  providers: [HealthCheckService],
  exports: [HealthCheckService],
})
export class HealthCheckModule {}
