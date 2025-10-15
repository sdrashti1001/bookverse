import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  MinLength, 
  IsIn, 
  IsNumber, 
  Min, 
  Max, 
  IsOptional, 
  MaxLength 
} from 'class-validator';

const currentYear = new Date().getFullYear();

export class CreateBookDto {
  @ApiProperty({
    description: 'The title of the book',
    example: 'NestJS for Beginners',
    minLength: 3,
  })
  @IsNotEmpty()
  @MinLength(3, { message: 'Minimum 3 characters required' })
  title!: string;

  @ApiProperty({
    description: 'The author of the book',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Author is required' })
  author!: string;

  @ApiProperty({
    description: 'The genre of the book',
    example: 'Programming',
    enum: ['Programming', 'Fiction', 'Science', 'History'],
  })
  @IsNotEmpty({ message: 'Genre is required' })
  @IsIn(['Programming', 'Fiction', 'Science', 'History'], {
    message: 'Genre must be one of Programming, Fiction, Science, History',
  })
  genre!: string;

  @ApiProperty({
    description: 'The publication year of the book',
    example: 2023,
    minimum: 1800,
    maximum: currentYear,
  })
  @IsNumber({}, { message: 'Year must be a number' })
  @Min(1800, { message: 'Year must not be less than 1800' })
  @Max(currentYear, { message: `Year must not be greater than ${currentYear}` })
  year?: number;

  @ApiProperty({
    description: 'A brief summary of the book',
    example: 'An in-depth guide to mastering NestJS.',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @MaxLength(500, { message: 'Summary cannot exceed 500 characters' })
  summary?: string;
}