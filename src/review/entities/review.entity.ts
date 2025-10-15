import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('reviews')
@Index(['bookId', 'userId'], { unique: true }) // composite unique index
export class Review {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  bookId!: ObjectId;

  @Column()
  userId!: ObjectId;

  @Column()
  rating!: number;

  @Column()
  comment!: string;

  @Column({ default: 0 })
  upvotes!: number;

  @Column({ default: 0 })
  downvotes!: number;

  @Column({ nullable: true })
  deletedAt?: Date;
}
