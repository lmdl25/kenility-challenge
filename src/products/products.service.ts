import {
  InternalServerErrorException,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Injectable,
  Logger,
} from '@nestjs/common'
import { isValidObjectId, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

import { CreateProductDto } from './dto/create-product.dto'
import { Product } from './entities/product.schema'

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name)
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
  ) {}

  /**
   * Creates a new product after validating input and checking for SKU uniqueness.
   * @param createProductDto - Data Transfer Object containing product details.
   * @returns The newly created product document.
   * @throws {ConflictException} If a product with the same SKU already exists.
   * @throws {InternalServerErrorException} If any other database error occurs during creation.
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    this.logger.log(
      `Attempting to create product with SKU: ${createProductDto.sku}`,
    )
    let existingProduct: Product | null = null
    try {
      existingProduct = await this.productModel
        .findOne({ sku: createProductDto.sku })
        .exec()
    } catch (error) {
      this.logger.error(
        `Error checking for existing SKU ${createProductDto.sku}: ${error.message}`,
        error.stack,
      )
      throw new InternalServerErrorException(
        'Error checking for product uniqueness.',
      )
    }

    if (existingProduct) {
      this.logger.warn(
        `SKU Conflict: Product with SKU "${createProductDto.sku}" already exists.`,
      )
      throw new ConflictException(
        `Product with SKU "${createProductDto.sku}" already exists.`,
      )
    }

    const newProduct = new this.productModel(createProductDto)
    try {
      const savedProduct = await newProduct.save()
      this.logger.log(
        `Successfully created product with ID: ${savedProduct._id} and SKU: ${savedProduct.sku}`,
      )
      return savedProduct
    } catch (error) {
      this.logger.error(
        `Failed to save product with SKU ${createProductDto.sku}: ${error.message}`,
        error.stack,
      )
      if (error.code === 11000) {
        throw new ConflictException(
          `Product with SKU "${createProductDto.sku}" already exists (database constraint).`,
        )
      }
      throw new InternalServerErrorException(
        'Failed to create product due to a database error.',
      )
    }
  }

  findAll() {
    return `This action returns all products`
  }

  /**
   * Finds a single product by its MongoDB ObjectId.
   * @param id - The MongoDB ObjectId (_id) of the product to retrieve.
   * @returns The found product document.
   * @throws {BadRequestException} If the provided ID is not a valid MongoDB ObjectId format.
   * @throws {NotFoundException} If no product with the given ID is found.
   * @throws {InternalServerErrorException} If a database error occurs during the query.
   */
  async findOneById(id: string): Promise<Product> {
    this.logger.log(`Attempting to find product with ID: ${id}`)

    if (!isValidObjectId(id)) {
      this.logger.warn(`Invalid ID format received: ${id}`)
      throw new BadRequestException(`Invalid ID format: "${id}"`)
    }

    let product: Product | null = null
    try {
      product = await this.productModel.findById(id).exec()
    } catch (error) {
      this.logger.error(
        `Error finding product with ID ${id}: ${error.message}`,
        error.stack,
      )
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: "${id}"`)
      }
      throw new InternalServerErrorException(
        'An error occurred while fetching the product.',
      )
    }

    if (!product) {
      this.logger.warn(`Product with ID "${id}" not found.`)
      throw new NotFoundException(`Product with ID "${id}" not found.`)
    }

    this.logger.log(`Successfully found product with ID: ${id}`)
    return product
  }

  async updateImageUrl(id: string, imageUrl: string) {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, { $set: { imageUrl: imageUrl } }, { new: true })
      .exec()

    if (!updatedProduct) {
      throw new NotFoundException(
        `Product with ID ${id} not found during update`,
      )
    }
    return updatedProduct
  }
}
