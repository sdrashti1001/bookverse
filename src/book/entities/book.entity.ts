import { ObjectId } from 'mongodb';
import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity('books')
export class Book {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column({ unique: true })
  title!: string;

  @Column()
  author!: string;

  @Column()
  genre!: string;

  @Column()
  year!: number;

  @Column({ nullable: true })
  summary?: string;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
