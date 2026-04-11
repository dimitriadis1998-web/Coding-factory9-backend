import User, { IUser } from '../models/user.model';
import Role, { IRole } from '../models/role.model';
import * as userDAO from '../dao/user.dao';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { toUserResponseDTO } from '../mappers/user.mapper';
import { AppError } from '../utils/appError';
import { CreateUserDTO, UpdateUserDTO } from '../dto/user.dto';

export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);

// MongoDB Errors
// https://www.mongodb.com/docs/manual/reference/error-codes/

// Mongoose
// Η .lean() είναι μια επιλογή ερωτήματος που επιστρέφει απλά αντικείμενα JavaScript (POJO) αντί για Mongoose Document. Βελτιώνει σημαντικά την απόδοση και μειώνει τη χρήση μνήμης (συχνά έως και 10 φορές πιο γρήγορα) παρακάμπτοντας την παρακολούθηση αλλαγών και την επικύρωση του Mongoose, καθιστώντας την ιδανική για αιτήματα GET μόνο για ανάγνωση.
export const findUsers = async () => {
  const users = await userDAO.findAll();
  return users.map(u => toUserResponseDTO(u));
};

export const findUserById = async (id: string) => {
  const user = await userDAO.findById(id);
  if (user) {
    return toUserResponseDTO(user); 
  }
    
};

export const findUserByEmail = async (email: string) => {
  const user = await userDAO.findByEmail(email);
  if (user) {
    return toUserResponseDTO(user); 
  }
};

export const findUserByUsername = async (username: string) => {
  return User.findOne({ username }).populate('roles');
};

// For Partial Type
// https://www.typescriptlang.org/docs/handbook/utility-types.html
export const createUser = async (payload: Partial<CreateUserDTO>) => {
  if (payload.password) {
    const hash = await bcrypt.hash(payload.password, SALT_ROUNDS);
    payload.password = hash;
  }

  let roleIds: Types.ObjectId[] = [];
  // console.log("Create User", payload);
  if (payload.roles && payload.roles.length > 0) {
    roleIds = payload.roles.map(id => new Types.ObjectId(id));
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
  return toUserResponseDTO(user);
};


export const updateUser = async (username: string, payload: UpdateUserDTO) => {
  const updateData: Partial<IUser> = {};

  if (payload.firstname !== undefined) updateData.firstname = payload.firstname;
  if (payload.lastname !== undefined) updateData.lastname = payload.lastname;
  if (payload.email !== undefined) updateData.email = payload.email;
  if (payload.address !== undefined) updateData.address = payload.address;
  if (payload.phone !== undefined) updateData.phone = payload.phone;

  if (payload.password) {
    updateData.password = await bcrypt.hash(payload.password, SALT_ROUNDS);
  }

  if (payload.roles) {
    updateData.roles = payload.roles.map(id => new Types.ObjectId(id));
  }

  const user = await userDAO.updateUser(username, updateData);
  return user ? toUserResponseDTO(user) : null;
};

export const deleteUser = async (username: string) => {
  const user = await userDAO.deleteUser(username);
  return user;
};