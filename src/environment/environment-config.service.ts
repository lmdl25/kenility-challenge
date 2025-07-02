import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EnvironmentConfigService {
  constructor(private readonly configService: ConfigService) {}
  getMongoUser() {
    const mongoUser = this.configService.getOrThrow<string>('MONGO_USER')
    if (typeof mongoUser !== 'string')
      throw new Error('MONGO_USER is not a string')
    return mongoUser
  }

  getMongoPassword() {
    const mongoPassword =
      this.configService.getOrThrow<string>('MONGO_PASSWORD')
    if (typeof mongoPassword !== 'string')
      throw new Error('MONGO_PASSWORD is not a string')
    return mongoPassword
  }

  getMongoURL() {
    const mongoURL = this.configService.getOrThrow<string>('MONGO_URL')
    if (typeof mongoURL !== 'string')
      throw new Error('MONGO_URL is not a string')
    return mongoURL
  }

  getSecret() {
    const jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET')
    if (typeof jwtSecret !== 'string')
      throw new Error('JWT_SECRET is not a string')
    return jwtSecret
  }

  getPort(): number {
    const port = Number(this.configService.getOrThrow<string>('PORT'))
    if (typeof port !== 'number') throw new Error('PORT is not a number')
    return port
  }
}
