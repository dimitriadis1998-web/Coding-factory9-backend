import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'
import AuthPayload from '../models/auth.model';
import { verifyGoogleIdToken } from '../utils/googleVerify';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
const JWT_EXPIRES = '7d';

export const register = async (data: any) => {
  // create user via user service logic would be nicer, but keep simple
  const user = new User(data);
  await user.save();
  return user;
};

export const login = async (username: string, password: string) => {
  const user = await User.findOne({ username }).populate('roles');
  if (!user) return null;
  
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;
  
  const payload: AuthPayload = { username: user.username, email: user.email || '', roles: user.roles };
  const token = jwt.sign(payload as any, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return { user, token };
};

export const googleLogin = async(idToken:string) =>{
  try {
    console.log(">>>",idToken)
    if (!idToken) {
      // return res.status(400).json({ error: 'Missing idToken' });
      return {status: false, message:"Missing idToken"};
    }

    const googleUser = await verifyGoogleIdToken(idToken);

    if (!googleUser.email_verified) {
      return {status: false, message:"Email not verified"};
    }
    
    let user = await User.findOne({ userId: googleUser.sub });
    if (!user) {
      user = new User({
        userId: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name,
        photoUrl: googleUser.picture,
        roles: ['user'] // default role
      });
      await user.save();
    } 
    
    const token = jwt.sign(
      {
        userId: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name,
        photoUrl: googleUser.picture,
        roles: user.roles
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return ({
      status: true,
      token
    });
  } catch (err) {
    console.error('Google auth error:', err);
    return {status: false, message:"Invalid Google token"};
  }
}