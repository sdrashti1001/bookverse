import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MongoRepository } from 'typeorm';
import { Review } from './entities/review.entity';
import { ObjectId } from 'mongodb';
import { CreateReviewDto, VoteReviewDto } from './dto/create-review.dto';
import { Vote } from './entities/votes.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: MongoRepository<Review>,

    @InjectRepository(Vote)
    private readonly voteRepository: MongoRepository<Vote>,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
    if (!userId) {
      throw new UnauthorizedException('User must be authenticated to add a review');
    }

    const bookObjectId = new ObjectId(createReviewDto.bookId);
    const userObjectId = new ObjectId(userId);

    const existingReview = await this.reviewRepository.findOneBy({
      bookId: bookObjectId,
      userId: userObjectId,
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

    const review = await this.reviewRepository.findOneBy({ _id: reviewObjectId });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const existingVote = await this.voteRepository.findOneBy({
      reviewId: reviewObjectId,
      userId: userObjectId,
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

    if (voteValue === 1) review.upvotes += 1;
    else review.downvotes += 1;

    return await this.reviewRepository.save(review);
  }

  async remove(id: string): Promise<void> {

    try{
      const review = await this.reviewRepository.findOneBy({ _id: new ObjectId(id) });
      if (!review) throw new NotFoundException('Review not found');

      review.deletedAt = new Date();
      await this.reviewRepository.save(review);
    }catch(error) {
      throw new BadRequestException('Failed to Delete Review');
  }
  }
}
