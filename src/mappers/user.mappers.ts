import { IUser } from '../models/user.model';
import { UserResponseDTO } from '../dto/user.dto';

export const toUserResponseDTO = (user: IUser): UserResponseDTO => {
  return {
    id: user._id.toString(),
    username: user.username,
    ...(user.firstname !== undefined && { firstname: user.firstname }),
    ...(user.lastname !== undefined && { lastname: user.lastname }),
    ...(user.email !== undefined && { email: user.email }),
    ...(user.address !== undefined && { address: user.address }),
    ...(user.phone !== undefined && {
    phone: user.phone.map(p => ({
        type: p.type,
        number: p.number
      }))
    }),

    roles: user.roles.map(r => r.toString())
  };
};