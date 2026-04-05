import User, { IUser } from '../models/user.model';

export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  const user = new User(data);
  return await user.save();
};

export const findById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

export const findByUsername = async (username: string): Promise<IUser | null> => {
  return await User.findOne({ username });
};