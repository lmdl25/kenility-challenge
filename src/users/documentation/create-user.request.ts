import { ApiProperty } from '@nestjs/swagger'

export class UserDocs {
  @ApiProperty({
    type: 'string',
    example: 'el-pepe',
  })
  username: string

  @ApiProperty({
    type: 'string',
    example: 'Cl@ve123',
  })
  password: string
}
