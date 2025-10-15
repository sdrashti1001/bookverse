import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Review } from 'src/review/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Review]),
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],  // export if used outside

})
export class BookModule { }
