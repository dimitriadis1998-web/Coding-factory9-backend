export interface IPhoneDTO {
  type: string;
  number: string;
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
  roles: string[];
}
