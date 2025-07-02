import {
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  Injectable,
  Logger,
} from '@nestjs/common'
import { isValidObjectId, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

import { OrderProductListItem, Order } from './schemas/order.schema'
import { Product } from '../products/entities/product.schema'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name)

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  /**
   * @summary Creates a new order based on client name and product list.
   * @description Calculates the total order amount based on current product prices.
   * @param {CreateOrderDto} createOrderDto - DTO containing client name and product list items (productId, quantity).
   * @returns {Promise<Order>} The newly created order document.
   * @throws {BadRequestException} If the product list is empty or contains invalid product IDs.
   * @throws {NotFoundException} If any product ID in the list does not correspond to an existing product.
   * @throws {InternalServerErrorException} If a product price cannot be determined or if a database error occurs during saving.
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    this.logger.log(
      `Attempting to create order for client: ${createOrderDto.clientName}`,
    )

    if (
      !createOrderDto.productList ||
      createOrderDto.productList.length === 0
    ) {
      throw new BadRequestException('Order productList cannot be empty.')
    }

    let calculatedTotal = 0
    const validatedProductList: OrderProductListItem[] = []

    for (const item of createOrderDto.productList) {
      if (!isValidObjectId(item.productId)) {
        throw new BadRequestException(
          `Invalid Product ID format: ${item.productId}`,
        )
      }
      const product = await this.productModel
        .findById(item.productId)
        .select('+price')
        .exec()
      if (!product) {
        throw new NotFoundException(
          `Product with ID "${item.productId}" not found.`,
        )
      }
      if (typeof product.price !== 'number' || product.price < 0) {
        this.logger.error(
          `Product ${item.productId} has an invalid price: ${product.price}`,
        )
        throw new InternalServerErrorException(
          `Could not determine price for product ${item.productId}.`,
        )
      }

      const pricePerUnit = product.price
      calculatedTotal += pricePerUnit * item.quantity

      validatedProductList.push({
        productId: item.productId,
        quantity: item.quantity,
        pricePerUnit: pricePerUnit,
      })
    }

    const newOrder = new this.orderModel({
      clientName: createOrderDto.clientName,
      productList: validatedProductList,
      total: calculatedTotal,
    })

    try {
      const savedOrder = await newOrder.save()
      this.logger.log(
        `Successfully created order ID: ${savedOrder._id} for client: ${savedOrder.clientName}`,
      )
      return savedOrder
    } catch (error) {
      this.logger.error(
        `Failed to save order for client ${createOrderDto.clientName}: ${error.message}`,
        error.stack,
      )
      throw new InternalServerErrorException(
        'Failed to create order due to a database error.',
      )
    }
  }

  /**
   * @summary Updates an existing order. Can update clientName and/or replace the productList.
   * @description If the productList is provided, it entirely replaces the existing list, and the order's total amount is recalculated based on current product prices.
   * @param {string} id - The MongoDB ObjectId of the order to update.
   * @param {UpdateOrderDto} updateOrderDto - DTO containing the fields to update (optional `clientName`, optional `productList`).
   * @returns {Promise<Order>} The updated order document.
   * @throws {BadRequestException} If the provided ID is invalid, if `productList` is provided but empty, if a product ID in the list is invalid, or if no valid fields are provided for update.
   * @throws {NotFoundException} If the order ID or any product ID in the new list does not exist.
   * @throws {InternalServerErrorException} If a product price cannot be determined or if a database error occurs.
   */
  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    this.logger.log(`Attempting to update order with ID: ${id}`)

    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid Order ID format: "${id}"`)
    }

    const updatesToApply: Partial<Order> = {}
    let newTotal: number | null = null

    if (updateOrderDto.clientName !== undefined) {
      updatesToApply.clientName = updateOrderDto.clientName
    }

    if (updateOrderDto.productList !== undefined) {
      if (
        !Array.isArray(updateOrderDto.productList) ||
        updateOrderDto.productList.length === 0
      ) {
        throw new BadRequestException(
          'If provided, productList cannot be empty.',
        )
      }

      let calculatedTotal = 0
      const validatedProductList: OrderProductListItem[] = []

      for (const item of updateOrderDto.productList) {
        if (!isValidObjectId(item.productId)) {
          throw new BadRequestException(
            `Invalid Product ID format in productList: ${item.productId}`,
          )
        }
        const product = await this.productModel
          .findById(item.productId)
          .select('+price')
          .exec()
        if (!product) {
          throw new NotFoundException(
            `Product with ID "${item.productId}" in productList not found.`,
          )
        }
        if (typeof product.price !== 'number' || product.price < 0) {
          this.logger.error(
            `Product ${item.productId} has an invalid price: ${product.price}`,
          )
          throw new InternalServerErrorException(
            `Could not determine price for product ${item.productId}.`,
          )
        }

        const pricePerUnit = product.price
        calculatedTotal += pricePerUnit * item.quantity

        validatedProductList.push({
          productId: item.productId,
          quantity: item.quantity,
          pricePerUnit: pricePerUnit,
        })
      }

      updatesToApply.productList = validatedProductList
      updatesToApply.total = calculatedTotal
      newTotal = calculatedTotal
    }

    if (Object.keys(updatesToApply).length === 0) {
      throw new BadRequestException('No valid fields provided for update.')
    }

    let updatedOrder: Order | null = null
    try {
      updatedOrder = await this.orderModel
        .findByIdAndUpdate(
          id,
          { $set: updatesToApply },
          { new: true, runValidators: true },
        )
        .exec()
    } catch (error) {
      this.logger.error(
        `Failed to update order ${id}: ${error.message}`,
        error.stack,
      )
      if (error.name === 'CastError' || error.name === 'ValidationError') {
        throw new BadRequestException(
          `Invalid data provided for update: ${error.message}`,
        )
      }
      throw new InternalServerErrorException(
        'Failed to update order due to a database error.',
      )
    }

    if (!updatedOrder) {
      this.logger.warn(`Order with ID "${id}" not found for update.`)
      throw new NotFoundException(`Order with ID "${id}" not found.`)
    }

    this.logger.log(
      `Successfully updated order with ID: ${id}. ${newTotal !== null ? `New total: ${newTotal}` : ''}`,
    )
    return updatedOrder
  }

  /**
   * @summary Calculates the total amount for all orders created within the last full calendar month.
   * @description This method sums the 'total' field of all orders where 'createdAt' falls within the previous calendar month (e.g., if run in April, calculates for March). It does NOT filter by any 'sold' or 'completed' status as the status field has been removed.
   * @returns {Promise<{ startDate: Date; endDate: Date; totalAmount: number }>} An object containing the start date, end date (UTC) of the calculated period and the total amount.
   * @throws {InternalServerErrorException} If a database error occurs during the aggregation.
   */
  async getTotalAmountForOrdersCreatedLastMonth(): Promise<{
    startDate: Date
    endDate: Date
    totalAmount: number
  }> {
    this.logger.log(
      'Calculating total amount for all orders created in the last month.',
    )

    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    const startDate = new Date(
      Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0, 0),
    )
    const endDate = new Date(
      Date.UTC(currentYear, currentMonth, 1, 0, 0, 0, 0) - 1,
    )

    this.logger.log(
      `Calculating total amount for orders created between ${startDate.toISOString()} and ${endDate.toISOString()}`,
    )

    try {
      const result = await this.orderModel
        .aggregate([
          {
            $match: {
              createdAt: {
                $gte: startDate,
                $lte: endDate,
              },
            },
          },
          {
            $group: {
              _id: null,
              totalAmountSum: { $sum: '$total' },
            },
          },
        ])
        .exec()

      const totalAmount = result.length > 0 ? result[0].totalAmountSum : 0
      this.logger.log(
        `Total amount for orders created last month: ${totalAmount}`,
      )

      return {
        startDate,
        endDate,
        totalAmount,
      }
    } catch (error) {
      this.logger.error(
        `Error calculating last month order total: ${error.message}`,
        error.stack,
      )
      throw new InternalServerErrorException(
        'Failed to calculate total order amount.',
      )
    }
  }

  /**
   * @summary Retrieves the single order with the highest 'total' amount overall.
   * @returns {Promise<Order | null>} The order document with the highest total amount, or null if no orders exist.
   * @throws {InternalServerErrorException} If a database error occurs during the query.
   */
  async getHighestAmountOrder(): Promise<Order | null> {
    this.logger.log('Finding the order with the highest total amount.')
    try {
      const highestOrder = await this.orderModel
        .findOne({})
        .sort({ total: -1 })
        .exec()

      if (highestOrder) {
        this.logger.log(
          `Highest amount order found: ID ${highestOrder._id}, Amount ${highestOrder.total}`,
        )
      } else {
        this.logger.log('No orders found in the database.')
      }
      return highestOrder
    } catch (error) {
      this.logger.error(
        `Error finding highest amount order: ${error.message}`,
        error.stack,
      )
      throw new InternalServerErrorException(
        'Failed to find highest amount order.',
      )
    }
  }
}
