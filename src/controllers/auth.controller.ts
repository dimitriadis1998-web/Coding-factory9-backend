import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import * as userService from '../services/user.service';

// REGISTER
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await userService.findUserByUsername(req.body.username);
    if (existing) {
      return res.status(400).json({ message: 'User exists' });
    }

    const created = await userService.createUser(req.body);

    return res.status(201).json({
      id: created._id,
      username: created.username,
      email: created.email
    });
  } catch (err) {
    next(err);
  }
};

// LOGIN
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const result = await authService.login(username, password);

    if (!result) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      token: result.token,
      user: {
        id: result.user._id,
        username: result.user.username
      }
    });
  } catch (err) {
    next(err);
  }
};

// GOOGLE LOGIN
export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    const result = await authService.googleLogin(token);

    if (!result.status) {
      return res.status(401).json({
        status: false,
        message: result.message
      });
    }

    return res.status(200).json({
      status: true,
      token: result.token
    });
  } catch (err) {
    next(err);
  }
};

// 🔥 ME (ΑΥΤΟ ΕΛΕΙΠΕ)
export const me = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    return res.json({
      user
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};