import { ErrorResponseNormalizerFilter } from 'src/interceptors/error.interceptor'
import { INestApplication } from '@nestjs/common'

export const setupFilters = (app: INestApplication) => {
  app.useGlobalFilters(app.get(ErrorResponseNormalizerFilter))
}
