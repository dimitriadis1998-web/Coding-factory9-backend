import { Types } from "mongoose";

export interface AuthPayload {
  username: string;  // user ID
  email: string;    // user email
  roles: Types.ObjectId[];    // optional: user role, etc.
}

export default AuthPayload;