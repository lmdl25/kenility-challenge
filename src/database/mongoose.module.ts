import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'

import { EnvironmentConfigService } from '../environment/environment-config.service'
import { EnvironmentConfigModule } from '../environment/environment-config.module'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: async (config: EnvironmentConfigService) => ({
        uri: config.getMongoURL(),
        user: config.getMongoUser(),
        pass: config.getMongoPassword(),
        authSource: 'admin',
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class MongooseConfigModule {}
