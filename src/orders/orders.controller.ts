import {
  NotFoundException,
  Controller,
  HttpStatus,
  UseGuards,
  HttpCode,
  Patch,
  Param,
  Post,
  Body,
  Get,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiParam,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger'

import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { OrderDocs } from './documentation/order.docs'
import { OrdersService } from './orders.service'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { Order } from './schemas/order.schema'

@ApiTags('Orders')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order successfully created.',
    type: OrderDocs,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request (validation error, empty product list, invalid product ID format).',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found (a specified product ID does not exist).',
  })
  @ApiResponse({
    status: 500,
    description:
      'Internal Server Error (database error, invalid product price).',
  })
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto)
  }

  @Get('stats/total-created-last-month')
  @ApiOperation({
    summary:
      'Get total amount for all orders created in the last full calendar month',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the start date, end date, and total amount calculated.',
    schema: {
      type: 'object',
      properties: {
        startDate: { type: 'string', format: 'date-time' },
        endDate: { type: 'string', format: 'date-time' },
        totalAmount: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error (database aggregation error).',
  })
  async getTotalLastMonth(): Promise<{
    startDate: Date
    endDate: Date
    totalAmount: number
  }> {
    return this.ordersService.getTotalAmountForOrdersCreatedLastMonth()
  }

  @Get('stats/highest-amount')
  @ApiOperation({
    summary: 'Get the order with the overall highest total amount',
  })
  @ApiResponse({
    status: 200,
    description: 'The order with the highest total amount.',
    type: OrderDocs,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found (no orders exist in the database).',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error (database query error).',
  })
  async getHighest(): Promise<Order> {
    const highestOrder = await this.ordersService.getHighestAmountOrder()
    if (!highestOrder) {
      throw new NotFoundException(
        'No orders found to determine the highest amount.',
      )
    }
    return highestOrder
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order (clientName and/or productList)' })
  @ApiParam({
    name: 'id',
    description: 'The MongoDB ObjectId of the order to update',
    type: String,
    required: true,
  })
  @ApiBody({
    description:
      'Fields to update (clientName, productList). If productList is provided, it replaces the existing list and total is recalculated.',
    type: UpdateOrderDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Order successfully updated.',
    type: Order,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request (invalid ID format, validation error in body, empty productList if provided, no valid fields to update).',
  })
  @ApiResponse({
    status: 404,
    description:
      'Not Found (order ID not found, or a product ID in the new list not found).',
  })
  @ApiResponse({
    status: 500,
    description:
      'Internal Server Error (database error, invalid product price).',
  })
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto)
  }
}
