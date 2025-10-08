import {Body, Controller, Post, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {Public} from "./decorator/public.decorator";

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userLoginDto: CreateUserDto) {
    return this.authService.register(userLoginDto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  async refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user.id);
  }
}
