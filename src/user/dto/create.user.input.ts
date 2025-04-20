// src/user/dto/create-user.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, Length, IsInt, Min, Max } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @Length(1, 50)
  name: string;

  @Field(() => Int)
  @IsInt()
  @Min(18)
  @Max(99)
  age: number;
}
