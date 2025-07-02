import { InjectConnection } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { Connection } from 'mongoose'

@Injectable()
export class HealthCheckService {
  constructor(@InjectConnection() private readonly connection: Connection) {}
  getStatus() {
    const status = this.connection.readyState
    const statusMap = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting',
    }
    return {
      status: 'ok',
      uptime: process.uptime(),
      databaseStatus: `${statusMap[status] || 'Unknown'}`,
    }
  }
}
