import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('votes')
@Index(['reviewId', 'userId'], { unique: true }) // Composite unique index
export class Vote {
    
    @ObjectIdColumn()
    id!: ObjectId;

    @Column()
    reviewId!: ObjectId;

    @Column()
    userId!: ObjectId;

    @Column()
    vote!: number; // e.g. 1 for upvote, -1 for downvote

    @Column({ type: 'timestamp', nullable: true })
    deletedAt?: Date;
}
