import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository, MongoRepository } from 'typeorm';
import { Review } from '../review/entities/review.entity';
import { ObjectId } from 'mongodb';
import { CreateBookDto } from './dto/create-book.dto';


export interface BookWithStats {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  averageRating: number;
  totalReviews: number;
}


@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: MongoRepository<Book>,

    @InjectRepository(Review)
    private readonly reviewRepository: MongoRepository<Review>,
  ) { }


  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }


  async findAll(
    page = 1,
    limit = 10,
    genre?: string,
    sort?: string,
  ): Promise<BookWithStats[]> {
    try {
      const skip = (page - 1) * limit;

      const match: any = { deletedAt: null };
      if (genre) match.genre = genre;

      const sortOptions: any = {};
      if (sort === 'rating_desc') {
        sortOptions.averageRating = -1;
      } else {
        sortOptions.title = 1;
      }

      const books = await this.bookRepository.aggregate([
        { $match: match },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'bookId',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            averageRating: { $avg: '$reviews.rating' },
            totalReviews: { $size: '$reviews' },
          },
        },
        { $sort: sortOptions },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            title: 1,
            author: 1,
            genre: 1,
            year: 1,
            averageRating: { $ifNull: ['$averageRating', 0] },
            totalReviews: 1,
          },
        },
      ]).toArray();

      return books.map((book) => ({
        id: book._id.toString(),
        title: book.title,
        author: book.author,
        genre: book.genre,
        year: book.year,
        averageRating: book.averageRating,
        totalReviews: book.totalReviews,
      }));
    } catch (error) {
      throw new BadRequestException('Failed to fetch books');
    }
  }

  async findOneWithReviews(id: string): Promise<any> {
    try {
      const bookId = new ObjectId(id);

      const book = await this.bookRepository.findOneBy({ id: bookId });
      if (!book) {
        throw new NotFoundException('Book not found');
      }

      const reviews = await this.reviewRepository.aggregate([
        { $match: { bookId: bookId } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            rating: 1,
            comment: 1,
            upvotes: 1,
            downvotes: 1,
            username: '$user.username',
          },
        },
      ]).toArray();

      const aggregateStats = await this.reviewRepository.aggregate([
        { $match: { bookId: bookId } },
        {
          $group: {
            _id: '$bookId',
            averageRating: { $avg: '$rating' },
            totalVotes: { $sum: { $add: ['$upvotes', '$downvotes'] } },
          },
        },
      ]).toArray();

      const stats = aggregateStats.length > 0
        ? aggregateStats[0]
        : { averageRating: 0, totalVotes: 0 };

      return {
        id: book.id.toString(),
        title: book.title,
        author: book.author,
        genre: book.genre,
        year: book.year,
        reviews,
        averageRating: stats.averageRating || 0,
        totalVotes: stats.totalVotes || 0,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to fetch book details');
    }
  }

  async findOne(id: string): Promise<Book | null> {
    const objectId = new ObjectId(id);
    return this.bookRepository.findOneBy({ id: objectId });
  }


async remove(id: string): Promise<void> {
  const book = await this.bookRepository.findOneBy({ id: new ObjectId(id) });
  if (!book) throw new NotFoundException('Book not found');

  book.deletedAt = new Date();
  await this.bookRepository.save(book);
}
}
