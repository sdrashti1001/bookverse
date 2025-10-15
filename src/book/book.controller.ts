import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpException, HttpStatus, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('books')
@ApiBearerAuth('jwt')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a Book' })
  @ApiResponse({ status: 201, description: 'Book created' })
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  async getBooks(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('genre') genre?: string,
    @Query('sort') sort?: string,
  ) {
    try {
      return await this.bookService.findAll(page, limit, genre, sort);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      // fallback if it's not an Error object
      throw new HttpException('Unknown error occurred', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getBookDetails(@Param('id') id: string) {
    try {
      return await this.bookService.findOneWithReviews(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      // fallback if it's not an Error object
      throw new HttpException('Unknown error occurred', HttpStatus.BAD_REQUEST);

    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}
