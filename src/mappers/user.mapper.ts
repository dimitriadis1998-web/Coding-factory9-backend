import { UserResponseDTO } from "../dto/user.dto";

export const toUserResponseDTO = (user: any): UserResponseDTO => {
  return {
    _id: user._id,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    address: user.address,
    phone: user.phone,
    roles: user.roles
  };
};