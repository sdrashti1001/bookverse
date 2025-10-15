import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Book } from 'src/book/entities/book.entity';
import { Vote } from './entities/votes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Review, Vote]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],  // export if used outside

})
export class ReviewModule { }
