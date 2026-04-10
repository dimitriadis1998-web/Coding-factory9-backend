import User, { IUser } from '../models/user.model';

export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  const user = new User(data);
  return await user.save();
};

export const findById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id).populate('roles').lean();
};

export const findByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email:email }).populate('roles').lean();;
};