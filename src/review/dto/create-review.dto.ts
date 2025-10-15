import { IsString, IsNotEmpty, IsNumber, Min, Max, IsMongoId, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'ID of the book to review',
    example: '64f839a2c2bfb4a6c78d1234',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  bookId!: string;

  @ApiProperty({
    description: 'Rating for the book (1 to 5)',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiProperty({
    description: 'Review comment',
    example: 'Great book with insightful content.',
  })
  @IsString()
  @IsNotEmpty()
  comment!: string;
}

export class VoteReviewDto {
  @ApiProperty({
    description: 'Vote type',
    enum: ['up', 'down'],
    example: 'up',
  })
  @IsIn(['up', 'down'])
  vote!: 'up' | 'down';
}
