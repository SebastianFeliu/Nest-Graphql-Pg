import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel } from './models/user.model';
import { UserFilterInput, CreateUserInput, UpdateUserInput } from './dto';


@Resolver(() => UserModel)
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(() => [UserModel])
    async users(
        @Args('filter', { nullable: true }) filter?: UserFilterInput,
        @Args('limit', { type: () => Int, nullable: true }) limit = 10,
        @Args('offset', { type: () => Int, nullable: true }) offset = 0,
    ): Promise<UserModel[]> {
        return this.userService.findWithFilter(filter ?? {}, limit, offset);
    }

    @Mutation(() => UserModel)
    async createUser(
        @Args('input') input: CreateUserInput
    ): Promise<UserModel> {
        return this.userService.create(input.name, input.age);
    }

    @Mutation(() => UserModel)
    async updateUser(
      @Args('id') id: string,
      @Args('input') input: UpdateUserInput,
    ): Promise<UserModel> {
      return this.userService.update(id, input);
    }
  
    @Mutation(() => Boolean)
    async deleteUser(@Args('id') id: string): Promise<boolean> {
      return this.userService.delete(id);
    }

    @Mutation(() => [UserModel])
    async seedUsers(@Args('count', { type: () => Int, nullable: true }) count: number = 1000): Promise<UserModel[]> {
        return this.userService.seedUsers(count);
    }
}
