import {registerAs} from "@nestjs/config";
import {JwtModuleOptions} from "@nestjs/jwt";
import process from "node:process";

export default registerAs('jwt', (): JwtModuleOptions => ({
  secret: process.env.SECRET_KEY,
  signOptions: {
    expiresIn: process.env.JWT_EXPIRE_IN
  }
}));