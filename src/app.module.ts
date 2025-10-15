import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { Book } from './book/entities/book.entity';
import { Review } from './review/entities/review.entity';

const throttlerConfig: ThrottlerModuleOptions = {
  ttl: 60,
  limit: 30,
} as any;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot(throttlerConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('DATABASE_URI'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User,Book,Review],
        synchronize: true,
      }),
    }),
    UserModule,
    BookModule,
    AuthModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
