import {Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from './decorator/public.decorator';
import { RefreshAuthGuard } from './guard/refresh-auth.guard';
import {JwtAuthGuard} from "./guard/jwt-auth.guard";

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userLoginDto: CreateUserDto) {
    return this.authService.register(userLoginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshAuthGuard)
  async refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user.id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout/:id')
  async signout(@Param('id') userId: number): Promise<{ message: string }> {
    await this.authService.signout(userId);
    return {
      message: 'Signout successfully!'
    }
  }
}
