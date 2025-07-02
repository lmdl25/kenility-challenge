import {
  InternalServerErrorException,
  MaxFileSizeValidator,
  FileTypeValidator,
  NotFoundException,
  UseInterceptors,
  ParseFilePipe,
  UploadedFile,
  Controller,
  HttpStatus,
  UseGuards,
  HttpCode,
  Logger,
  Param,
  Patch,
  Post,
  Body,
  Get,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiConsumes,
  ApiParam,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

import { ProductDocs } from './documentation/create-product.request'
import { CreateProductDto } from './dto/create-product.dto'
import { MinioService } from '../minio/minio.service'
import { ProductsService } from './products.service'
import { Product } from './entities/product.schema'
import { JwtAuthGuard } from '../auth/jwt.guard'

@ApiTags('Products')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name)

  constructor(
    private readonly productsService: ProductsService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({
    description: 'Data for creating a new product',
    type: CreateProductDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: ProductDocs,
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The MongoDB ObjectId of the product to retrieve',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the product.',
    type: ProductDocs,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format provided.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Product with the specified ID not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Failed to retrieve product.',
  })
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOneById(id)
  }

  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload or update an image for a product' })
  @ApiParam({ name: 'id', description: 'The ID (ObjectId) of the product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Product image file (PNG, JPG, GIF, WEBP up to 5MB recommended)',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiOkResponse({
    description: 'Image uploaded successfully, returns updated product',
    type: ProductDocs,
  })
  @ApiNotFoundResponse({ description: 'Product not found with the given ID' })
  @ApiBadRequestResponse({
    description: 'Invalid file type or size, or upload failed',
  })
  async uploadProductImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    const product = await this.productsService.findOneById(id)
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`)
    }

    const fileExtension = file.originalname.split('.').pop()
    const objectKey = `${product.sku || id}/${Date.now()}.${fileExtension}`

    try {
      const imageUrl = await this.minioService.uploadFile(file, objectKey)

      const updatedProduct = await this.productsService.updateImageUrl(
        id,
        imageUrl.url,
      )
      return updatedProduct
    } catch (error) {
      this.logger.error(`Failed to upload image for product ${id}:`, error)
      throw new InternalServerErrorException('Failed to upload product image.')
    }
  }
}
