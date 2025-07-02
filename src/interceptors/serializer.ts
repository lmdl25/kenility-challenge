import { ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

import { PageSerializeDto, PageDto } from '../pagination/page-dto'

export interface ClassContrustor {
  new (...args: unknown[]): object
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(
    private dto: ClassContrustor,
    private isPaginated: boolean = false,
  ) {}
  intercept(_: ExecutionContext, handler: CallHandler): Observable<unknown> {
    if (this.isPaginated) {
      return handler.handle().pipe(
        map((data: PageDto<unknown>) => {
          const transformedItems = data.items.map((item: unknown) =>
            plainToInstance(this.dto, item, {
              excludeExtraneousValues: true,
              exposeUnsetFields: false,
            }),
          )

          return new PageSerializeDto(
            transformedItems,
            data.count,
            data.pages,
            data.currentPage,
          )
        }),
      )
    }

    return handler.handle().pipe(
      map((data: ClassContrustor) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
          exposeUnsetFields: false,
        })
      }),
    )
  }
}
