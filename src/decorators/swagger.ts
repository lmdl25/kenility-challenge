import {
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
  ApiProperty,
} from '@nestjs/swagger'
import { applyDecorators, Type } from '@nestjs/common'

export class BaseResponseDto<T> {
  data: T
}

export class BasePaginatedResponseDto<T> {
  items: T[]
  @ApiProperty({ example: 1 })
  count: number
  @ApiProperty({ example: 1 })
  currentPage: number
  @ApiProperty({ example: 1 })
  pages: number
}

export const CustomApiOkResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(BaseResponseDto, dataDto),
    ApiOkResponse({
      description: 'Successful Operation',
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(dataDto),
              },
            },
          },
        ],
      },
    }),
  )
