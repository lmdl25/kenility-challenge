import { ConfigService, ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import * as Minio from 'minio'

import { MinioService } from './minio.service'

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'MINIO_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Minio.Client({
          endPoint: configService.getOrThrow<string>('MINIO_ENDPOINT'),
          port: Number(configService.getOrThrow<string>('MINIO_PORT')),
          useSSL: false,
          accessKey: configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
          secretKey: configService.getOrThrow<string>('MINIO_SECRET_KEY'),
        })
      },
    },
    MinioService,
  ],
  exports: [MinioService],
})
export class MinioServiceModule {}
