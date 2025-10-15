import { Column, Entity, ObjectIdColumn } from "typeorm";
import { ObjectId } from 'mongodb';

@Entity('users')
export class User {

  @ObjectIdColumn()
  id!: ObjectId;

  @Column({ unique: true })
  username!: string;

  @Column()
  email?: string;

  @Column()
  password!: string;
}

