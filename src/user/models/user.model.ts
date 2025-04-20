import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType('User')
export class UserModel {
  @Field(() => ID, { nullable: true }) // 👈 Esto lo hace opcional
  id?: string;

  @Field()
  name: string;

  @Field(() => Int)
  age: number;
}
