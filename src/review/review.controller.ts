import { Controller, Post, Body, UseGuards, Request, Patch, Param, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, VoteReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiForbiddenResponse, ApiParam,
} from '@nestjs/swagger';

@ApiTags('Reviews')
@ApiBearerAuth('jwt')
@Controller('api/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Add a review for a book' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiBadRequestResponse({ description: 'Validation failed or review already exists' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    const userId = req.user.id;
    return await this.reviewService.create(createReviewDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/vote')
  @ApiOperation({ summary: 'Upvote or downvote a review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Vote recorded successfully' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiNotFoundResponse({ description: 'Review not found' })
  @ApiForbiddenResponse({ description: 'User has already voted' })
  async vote(
    @Param('id') id: string,
    @Body() voteReviewDto: VoteReviewDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.reviewService.vote(id, voteReviewDto, userId);
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
