import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import process from "node:process";
import {Public} from "./auth/decorator/public.decorator";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    console.log(process.env.SECRET_KEY)
    return this.appService.getHello();
  }
}
