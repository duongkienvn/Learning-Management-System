import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import process from 'node:process';

export default registerAs(
  'refresh-jwt',
  (): JwtSignOptions => ({
    secret: process.env.REFRESH_SECRET_KEY,
    expiresIn: process.env.REFRESH_EXPIRE_IN,
  }),
);
