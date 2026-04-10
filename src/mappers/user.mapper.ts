import { IUser } from '../models/user.model';
import { UserResponseDTO } from '../dto/user.dto';
import { RoleMapper } from "./role.mapper";

export const toUserResponseDTO = (user: IUser): UserResponseDTO => {
  return {
    id: user._id.toString(),
    username: user.username,
    ...(user.firstname && { firstname: user.firstname }),
    ...(user.lastname && { lastname: user.lastname }),
    ...(user.email && { email: user.email }),
    ...(user.address && { address: user.address }),
    ...(user.phone && {
      phone: user.phone.map(p => ({
        type: p.type,
        number: p.number
      }))
    }),

    roles: user.roles.map(role => RoleMapper.toDTO(role))
  };
};