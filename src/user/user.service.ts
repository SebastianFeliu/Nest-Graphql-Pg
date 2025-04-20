import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, MoreThanOrEqual, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { faker } from '@faker-js/faker/locale/en';
import { UserFilterInput, UpdateUserInput } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findWithFilter(filter: UserFilterInput = {}, limit = 10, offset = 0): Promise<User[]> {
    const where: any = {};

    if (filter.minAge !== undefined) {
      where.age = MoreThanOrEqual(filter.minAge);
    }

    const options: FindManyOptions<User> = {
      where,
      take: limit,
      skip: offset,
    };

    return this.userRepository.find(options);
  }

  async create(name: string, age: number): Promise<User> {
    const user = this.userRepository.create({ name, age });
    return this.userRepository.save(user);
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, input);
    return this.userRepository.save(user);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }

  seedUsers(count: number = 1000): Promise<User[]> {
    const users = Array.from({ length: count }, () => {
      return this.userRepository.create({
        name: faker.person.fullName(),
        age: faker.number.int({ min: 18, max: 70 }),
      });
    });
    return this.userRepository.save(users);
  }
}