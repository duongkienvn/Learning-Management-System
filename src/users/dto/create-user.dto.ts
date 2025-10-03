import { IsEmail, IsNotEmpty, Length, MIN } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 50)
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @Length(6, 10)
  password: string;
}
