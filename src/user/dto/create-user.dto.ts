import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {

    @IsString()
    @MinLength(3, { message: 'username must be of atleast 3 characters' })
    @Matches(/^[A-Za-z0-9]+$/, { message: "username should be alphanumeric" })
    @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
    username!: string;

    @IsEmail({}, { message: 'Invalid email format' })
    @ApiProperty({ description: 'The email of the user', example: 'john@example.com' })
    email?: string;

    @IsString()
    @MinLength(8, { message: 'Minimum 8 characters are required' })
    @Matches(/(?=.*[A-Z])/, {
        message: 'Password must include at least one uppercase letter',
    })
    @Matches(/(?=.*\d)/, {
        message: 'Password must include at least one number',
    })
    @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
        message: 'Password must include at least one symbol',
    })
    @ApiProperty({ description: 'The password of the user', example: 'password123' })
    password!: string;
}

