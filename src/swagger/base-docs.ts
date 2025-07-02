import { ApiProperty } from '@nestjs/swagger'

export class BaseDocs {
  @ApiProperty({
    description: 'Unique identifier for the resource (MongoDB ObjectId)',
    example: '67ed1e82783c5ac094237ee7',
    type: String,
  })
  _id: string

  @ApiProperty({
    description:
      'Timestamp when the resource was created in UTC (ISO 8601 format)',
    example: '2025-04-02T11:24:50.863Z',
    type: Date,
  })
  createdAt: Date

  @ApiProperty({
    description:
      'Timestamp when the resource was last updated in UTC (ISO 8601 format)',
    example: '2025-04-02T11:24:50.863Z',
    type: Date,
  })
  updatedAt: Date

  @ApiProperty({
    description:
      'Document version key used internally by Mongoose for optimistic concurrency control',
    example: 0,
    type: Number,
  })
  __v: number

  @ApiProperty({
    description:
      'Timestamp when the resource was soft-deleted. Null if the resource is active.',
    example: null,
    type: Date,
    nullable: true,
    required: false,
  })
  deletedAt?: Date | null
}
