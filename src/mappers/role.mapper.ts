import { RoleDTO } from "../dto/role.dto";

export const RoleMapper = {
  toDTO(role: any): RoleDTO {
    return {
      id: role._id.toString(),
      description: role.description,
      active: role.active
    };
  }
};