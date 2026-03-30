import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /** Browsers request this by default; avoid 404 noise in API logs. */
  @Get('favicon.ico')
  favicon(@Res() res: Response) {
    res.status(204).end();
  }
}
