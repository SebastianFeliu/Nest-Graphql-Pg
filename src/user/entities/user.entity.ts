import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@Entity() // Define la tabla en la base de datos
export class User {
  @PrimaryGeneratedColumn('uuid') // Genera un ID único
  id: string;

  @Column()
  name: string;

  @Column()
  age: number;
}