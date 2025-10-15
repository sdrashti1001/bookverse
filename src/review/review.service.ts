import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { ObjectId } from 'mongodb';
import { CreateReviewDto, VoteReviewDto } from './dto/create-review.dto';
import { Vote } from './entities/votes.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
    if (!userId) {
      throw new UnauthorizedException('User must be authenticated to add a review');
    }

    const bookObjectId = new ObjectId(createReviewDto.bookId);
    const userObjectId = new ObjectId(userId);

    // Check if user already reviewed this book
    const existingReview = await this.reviewRepository.findOne({
      where: { bookId: bookObjectId, userId: userObjectId },
    });
    if (existingReview) {
      throw new BadRequestException('You have already reviewed this book.');
    }

    const review = this.reviewRepository.create({
      bookId: bookObjectId,
      userId: userObjectId,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      upvotes: 0,
      downvotes: 0,
    });

    return await this.reviewRepository.save(review);
  }

  async vote(reviewId: string, voteDto: VoteReviewDto, userId: string): Promise<Review> {
    if (!userId) {
      throw new UnauthorizedException('User must be authenticated to vote');
    }

    const reviewObjectId = new ObjectId(reviewId);
    const userObjectId = new ObjectId(userId);

    const review = await this.reviewRepository.findOneBy({ id: reviewObjectId });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check if vote exists
    const existingVote = await this.voteRepository.findOne({
      where: { reviewId: reviewObjectId, userId: userObjectId },
    });
    if (existingVote) {
      throw new ForbiddenException('You have already voted on this review');
    }

    const voteValue = voteDto.vote === 'up' ? 1 : voteDto.vote === 'down' ? -1 : 0;
    if (voteValue === 0) {
      throw new BadRequestException('Invalid vote value');
    }

    const vote = this.voteRepository.create({
      reviewId: reviewObjectId,
      userId: userObjectId,
      vote: voteValue,
    });
    await this.voteRepository.save(vote);

    // Update Review counts
    if (voteValue === 1) {
      review.upvotes += 1;
    } else {
      review.downvotes += 1;
    }
    return await this.reviewRepository.save(review);
  }

  async remove(id: string): Promise<void> {
    const review = await this.reviewRepository.findOneBy({ id: new ObjectId(id) });
    if (!review) throw new NotFoundException('Review not found');

    review.deletedAt = new Date();
    await this.reviewRepository.save(review);
  }
}
