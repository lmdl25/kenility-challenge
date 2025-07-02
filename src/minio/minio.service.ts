import {
  InternalServerErrorException,
  Injectable,
  Inject,
  Logger,
} from '@nestjs/common'
import { ItemBucketMetadata, Client } from 'minio'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name)
  private readonly bucketName: string
  private readonly externalUrlBase: string

  constructor(
    @Inject('MINIO_CLIENT') private readonly minioClient: Client,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET')
    this.externalUrlBase =
      this.configService.getOrThrow<string>('MINIO_EXTERNAL_URL')
  }

  /**
   * Uploads a file to the configured MinIO bucket.
   * @param file The file object from Multer.
   * @param baseObjectPath A base path like product SKU or ID for structuring storage.
   * @returns Promise<{ objectKey: string; url: string }> The key and publicly accessible URL.
   */
  async uploadFile(
    file: Express.Multer.File,
    baseObjectPath: string,
  ): Promise<{ objectKey: string; url: string }> {
    const fileExtension = file.originalname.split('.').pop() || 'bin'
    const sanitizedBasePath = baseObjectPath.replace(/[^a-zA-Z0-9-_]/g, '_')
    const objectKey = `${sanitizedBasePath}/${Date.now()}.${fileExtension}`

    const metaData: ItemBucketMetadata = {
      'Content-Type': file.mimetype,
    }

    this.logger.log(
      `Uploading file to bucket '${this.bucketName}' with key '${objectKey}'...`,
    )

    try {
      await this.minioClient.putObject(
        this.bucketName,
        objectKey,
        file.buffer,
        file.size,
        metaData,
      )

      const url = `${this.externalUrlBase.replace(/\/$/, '')}/${objectKey}`

      this.logger.log(`File uploaded successfully. URL: ${url}`)
      return { objectKey, url }
    } catch (error) {
      this.logger.error(
        `Failed to upload file with key ${objectKey} to bucket ${this.bucketName}:`,
        error,
      )
      throw new InternalServerErrorException(
        'Failed to upload file to storage.',
      )
    }
  }

  /**
   * Extracts the object key from a full MinIO URL.
   * Assumes the URL structure is {externalUrlBase}/{objectKey}
   * @param url The full URL of the object.
   * @returns string | null The extracted object key or null if extraction fails.
   */
  getObjectKeyFromUrl(url: string): string | null {
    if (!url || !url.startsWith(this.externalUrlBase)) {
      return null
    }
    const key = url.substring(this.externalUrlBase.length).replace(/^\//, '')
    return key || null
  }
}
