import { Exclude, Expose, Type } from 'class-transformer';
import { RoleResponseDto } from '../../roles/dto/role-response.dto';

@Exclude()
export class UserResponseDto {
  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  @Type(() => RoleResponseDto)
  role: RoleResponseDto;
}
