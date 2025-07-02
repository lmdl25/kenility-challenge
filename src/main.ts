import { NestFactory } from '@nestjs/core'

import { EnvironmentConfigService } from './environment/environment-config.service'
import { setupSwagger } from './swagger/swagger-setup'
import { setupFilters } from './filters/filters-setup'
import { setupPipes } from './pipes/validation.pipe'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  setupSwagger(app)
  setupPipes(app)
  setupFilters(app)
  const config = app.get(EnvironmentConfigService)
  await app.listen(config.getPort())
  // eslint-disable-next-line @/no-restricted-properties
  console.log(`
  ===========================
  🚀 App is running on http://localhost:${process.env.NODE_LOCAL_PORT}
  ===========================
`)
}
bootstrap()
