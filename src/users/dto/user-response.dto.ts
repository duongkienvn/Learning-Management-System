import { Exclude, Expose, Type } from 'class-transformer';
import { RoleResponseDto } from '../../roles/dto/role-response.dto';

@Exclude()
export class UserResponseDto {
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
