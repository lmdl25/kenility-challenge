import { Module } from '@nestjs/common'

import { ErrorResponseNormalizerFilter } from './error.interceptor'

@Module({
  providers: [ErrorResponseNormalizerFilter],
  exports: [ErrorResponseNormalizerFilter],
})
export class ResponseNormalizerModule {}
