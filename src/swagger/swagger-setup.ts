import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export enum SECURITY {
  JWT_TOKEN = 'JWT-auth',
}

export const setupSwagger = (app: INestApplication) => {
  const configService = app.get(ConfigService)
  const config = new DocumentBuilder()
    .setTitle('Kenility Challenge Api')
    .setDescription(
      '**README.me:** [Click here](https://github.com/trustyCappelletti/kenility-challenge/blob/master/README.md)',
    )
    .setVersion(configService.get<string>('API_VERSION', 'Missing'))
    .addApiKey(
      {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'JWT Token',
      },
      SECURITY.JWT_TOKEN,
    )
    .build()
  const document = SwaggerModule.createDocument(app, config, {
    autoTagControllers: false,
  })
  SwaggerModule.setup('docs', app, document, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Kenility Challenge Api',
    swaggerOptions: {
      operationsSorter: 'method',
      persistAuthorization: true,
    },
  })
}
