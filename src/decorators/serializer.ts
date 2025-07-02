import { UseInterceptors } from '@nestjs/common'

import {
  SerializeInterceptor,
  ClassContrustor,
} from '../interceptors/serializer'

export function Serialize(dto: ClassContrustor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}
