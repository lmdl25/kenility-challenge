import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { Model } from 'mongoose'

import { UsernameAlreadyInUseError } from './errors/users.errors'
import { CreateUserRequestDto } from './dto/create-user.dto'
import { IUser } from './interfaces/user.interface'

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly usersModel: Model<IUser>) {}
  async create(createUserDto: CreateUserRequestDto) {
    const existingUser = await this.usersModel.findOne({
      username: createUserDto.username,
    })
    if (existingUser?.id) {
      throw new UsernameAlreadyInUseError('This username is already registered')
    }
    const hashedPassword = bcrypt.hashSync(createUserDto.password, 12)
    const newUser = new this.usersModel({
      ...createUserDto,
      password: hashedPassword,
    })
    return await newUser.save()
  }

  async findByUsername(username: string) {
    return await this.usersModel.findOne({ username })
  }

  async updateToken(username: string, token: string) {
    return await this.usersModel.findOneAndUpdate({ username }, { token })
  }
}
