import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { IUser } from '../models/user.model';
import { CreateUserDTO, UserResponseDTO } from '../dto/user.dto';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.municipality) filter['address.municipality'] = req.query.municipality;
    const result = await userService.findUsers(filter);
    res.json(result);
  } catch (err) { 
    // next(err);
    console.log(err)
    res.status(401).json(err);  
  }
};

export const getOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: string = req.params.id!;
    const result = await userService.findUserById(id);
    if (!result) return res.status(404).json({ message: 'User not found by id' });
    res.status(201).json(result);
  } catch (err) { 
    next(err);
    console.log(err)
    res.status(500).json(err); 
  }
};

export const getOneByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email: string = req.params.email!;
    const result = await userService.findUserByEmail(email);
    if (!result) return res.status(404).json({ message: 'User not found by email' });
    res.status(201).json(result);
  } catch (err) { 
    // next(err);
    console.log(err)
    res.status(500).json(err);  
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: IUser = req.body;
    const result = await userService.createUser(data);
    res.status(201).json(result);
  } catch (err) { 
    // next(err);
    console.log(err)
    res.status(401).json(err); 
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: Partial<IUser> = req.body;
    const username: string = req.params.username!;
    const result = await userService.updateUser(username, data);
    res.status(201).json(result);
  } catch (err) { 
    // next(err);
    console.log(err)
    res.status(401).json(err);  
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username: string = req.params.username!;
    const result = await userService.deleteUser(username);
    res.status(201).json({ deleted: !!result });
  } catch (err) { 
    // next(err);
    console.log(err)
    res.status(401).json(err);  
  }
};
// Το !!result είναι μια διπλή άρνηση που μετατρέπει ΟΠΟΙΑΔΗΠΟΤΕ τιμή σε αυστηρή λογική τιμή:
// !value → μετατρέπει σε λογική τιμή και την αντιστρέφει
// !!value → την αντιστρέφει δύο φορές → το τελικό αποτέλεσμα είναι αληθές ή ψευδές
// Αυτό σημαίνει:
// Εάν η λειτουργία διαγραφής βρήκε και διέγραψε έναν χρήστη → το αποτέλεσμα είναι ένα αντικείμενο → το !!result γίνεται αληθές
// Εάν η λειτουργία διαγραφής δεν βρήκε έναν χρήστη → το αποτέλεσμα είναι null → το !!result γίνεται ψευδές
// Παράδειγμα:
// const result = await User.findByIdAndDelete(id);
// Εάν υπάρχει χρήστης → επιστρέφει το διαγραμμένο αντικείμενο χρήστη → truthy → !!result === true
// Εάν ΔΕΝ υπάρχει χρήστης → επιστρέφει null → falsy → !!result === false