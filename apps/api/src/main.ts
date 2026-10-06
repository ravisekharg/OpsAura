import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  })

  const config = app.get(ConfigService)

  app.use(helmet())
  app.use(cookieParser(config.get('COOKIE_SECRET')))

  app.setGlobalPrefix('v1')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())

  const allowedOrigins = (config.get<string>('FRONTEND_URL') ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)

  app.enableCors({
    origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  })

  const swagger = new DocumentBuilder()
    .setTitle('OpsAura API')
    .setDescription('OpsAura Incident Response Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swagger)
  SwaggerModule.setup('docs', app, document)

  const port = config.get<number>('PORT', 4000)
  await app.listen(port)

  console.log(`OpsAura API running on http://localhost:${port}/v1`)
  console.log(`Swagger docs at http://localhost:${port}/docs`)
}

bootstrap()
