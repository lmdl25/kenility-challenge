import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'

import { HealthCheckResponseDto } from './dto/health-check.dto'
import { CustomApiOkResponse } from '../decorators/swagger'
import { HealthCheckService } from './health-check.service'
import { Serialize } from '../decorators/serializer'

@Controller('health-check')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @ApiTags('Health')
  @ApiOperation({
    summary: 'Health Check',
    description: 'Returns the current status and uptime of the service.',
  })
  @CustomApiOkResponse(HealthCheckResponseDto)
  @Serialize(HealthCheckResponseDto)
  @Get()
  health() {
    return this.healthCheckService.getStatus()
  }
}
