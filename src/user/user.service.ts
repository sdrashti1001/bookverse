import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService
  ) { }

   async create(createUserDto: CreateUserDto): Promise<User> {
    try{
    const saltRounds = parseInt(this.configService.get<string>('SALT_ROUNDS') ?? '10', 10);

    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }catch(error) {
    if (
      error instanceof Error &&
      ('code' in error || 'errmsg' in error) &&
      (error as any).message?.includes('duplicate key') // Generic safe check
    ) {
      throw new BadRequestException('User with this field already exists');
    }

    throw new BadRequestException('Failed to create user');
  }
}
}