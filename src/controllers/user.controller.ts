import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { IUser } from '../models/user.model';
import { UserResponseDTO } from '../dto/user.dto';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.municipality) filter['address.municipality'] = req.query.municipality;
    const users = await userService.findUsers(filter);
    res.json(users);
  } catch (err) { next(err); }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // To είχαμε έτσι και εμφάνιζε μήνυμα για req.params.id γιατί μπορεί να μην υπάρχει
    // const user = await userService.findUserById(req.params.id);
    // Δύο λύσεις ή req.params.id! ή
    // if (!req.params.id) {
    //   return res.status(400).json({ message: 'Missing user ID' });
    // }
    // const user = await userService.findUserById(req.params.id);
    const user = await userService.findUserById(req.params.id!);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
};

export const getOneByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.findUserByEmail(req.params.email!);
    if (user) return res.status(200).json(user);
    res.status(401).json({message:"Not Found"});
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: IUser = req.body;
    const user: UserResponseDTO = await userService.createUser(data);
    res.status(201).json(user);
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUser(req.params.username!, req.body);
    res.status(201).json(user);
  } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const r = await userService.deleteUser(req.params.username!);
    res.status(201).json({ deleted: !!r });
  } catch (err) { next(err); }
};
