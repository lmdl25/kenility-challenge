import {
  InternalServerErrorException,
  BadRequestException,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Catch,
} from '@nestjs/common'

@Catch()
export class ErrorResponseNormalizerFilter implements ExceptionFilter {
  async catch(rawException: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()

    const response = ctx.getResponse()

    // eslint-disable-next-line @/no-restricted-properties
    console.log(rawException, '<<<< que está pasando')

    const exception =
      rawException instanceof HttpException
        ? rawException
        : new InternalServerErrorException()

    const status = exception.getStatus()

    await response.status(status).send({ error: this.mapToError(exception) })
  }

  private mapToError(error: HttpException) {
    return {
      message: error.message,
      status: error.getStatus(),
      reasons: this.getReasons(error),
    }
  }

  private getReasons(error: HttpException): string[] | undefined {
    if (!(error instanceof BadRequestException)) {
      return
    }

    const response = error.getResponse() as { message?: string[] }
    return response?.message || []
  }
}
