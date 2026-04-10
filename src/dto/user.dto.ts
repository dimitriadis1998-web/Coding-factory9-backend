import { RoleDTO } from "./role.dto";

export interface IPhoneDTO {
  type: string;
  number: string;
}

export interface CreateUserDTO {
  username: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  address?: {
    area?: string;
    street?: string;
    number?: string;
    po?: string;
    municipality?: string;
  };
  phone?: IPhoneDTO[];
  roles: RoleDTO[];
}

export interface UserResponseDTO {
  id: string;
  username: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  address?: {
    area?: string;
    street?: string;
    number?: string;
    po?: string;
    municipality?: string;
  };
  phone?: IPhoneDTO[];
  roles: RoleDTO[];
}
