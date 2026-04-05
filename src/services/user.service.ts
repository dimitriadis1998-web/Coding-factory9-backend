import User, { IUser } from '../models/user.model';
import Role, { IRole } from '../models/role.model';
import * as userDAO from '../dao/user.dao';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { toUserResponseDTO } from '../mappers/user.mappers';

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);

export const findUsers = async (filter: any = {}) => {
  return User.find(filter).populate('roles').lean();
};

export const findUserById = async (id: string) => {
  return User.findById(id).populate('roles').lean();
};

export const findUserByEmail = async (email: string) => {
  return User.findOne({email:email}).populate('roles').lean();
};

export const findUserByUsername = async (username: string) => {
  return User.findOne({ username }).populate('roles');
};

// For Partial Type
// https://www.typescriptlang.org/docs/handbook/utility-types.html
export const createUser = async (payload: Partial<IUser>) => {
  if (payload.password) {
    const hash = await bcrypt.hash(payload.password, SALT_ROUNDS);
    payload.password = hash;
  }

  let roleIds: Types.ObjectId[] = [];
  console.log("Create User", payload);
  if (payload.roles && payload.roles.length > 0) {
    roleIds = payload.roles as any;
  } else {
    let reader: IRole | null = await Role.findOne({ role: 'READER' });
    if (!reader) {
      reader = await Role.create({ role: 'READER', description: 'Default reader role', active: true });
    }
    roleIds = [reader._id];
  }

  // const user = new User({ ...payload, roles: roleIds });
  const user = await userDAO.createUser({
    ...payload,
    roles: roleIds
  });
  // return toUserResponseDTO(await user.save());
  return toUserResponseDTO(user);
};

export const updateUser = async (username: string, payload: Partial<IUser>) => {
  if (payload.password) {
    const hash = await bcrypt.hash(payload.password, SALT_ROUNDS);
    payload.password = hash;
  }
  return User.findOneAndUpdate({username:username}, payload, { new: true }).populate('roles');
};

export const deleteUser = async (username: string) => {
  return User.findOneAndDelete({username:username});
};