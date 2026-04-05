import { Schema, model, Document, Types } from "mongoose";

interface IPhone { type: string; number: string; }

export interface IUser extends Document {
  username: string;
  password: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  address?: {
    area?: string; street?: string; number?: string; po?: string; municipality?: string;
  };
  phone?: IPhone[];
  roles: Types.ObjectId[];
}

const PhoneSchema = new Schema<IPhone>({ type: String, number: String }, { _id: false });

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: String,
  lastname: String,
  email: { type: String, index: true },
  address: {
    area: String, 
    street: String, 
    number: String, 
    po: String, 
    municipality: String
  },
  phone: [PhoneSchema],
  roles: [{ type: Schema.Types.ObjectId, ref: "Role", required: true }]
}, 
{ 
  collection: 'users',
  timestamps: true 
});

export default model<IUser>("User", UserSchema);

// let userSchema = new Schema({
//   username: {
//     type: String, 
//     required: [ true, 'Username is required field' ], 
//     max: 100, 
//     unique:true,
//     trim:true,
// 		lowercase:true, 
//   },
//   password: {type: String, required: [true, 'Password is required field'], max: 100},
//   name: {type: String, required: [ true, 'Name is required field' ], max: 100},
//   surname: {type: String, required: [ true, 'Surname is required field' ], max: 100},
//   email: {
//     type: String, 
//     required: [true, 'Email is required field'], 
//     max: 100, 
//     unique:true,
//     trim:true,
// 		lowercase:true, 
//     // validate: [validateEmail, "Please fill a valid email address"],
//     match: [
//       /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//       "Email address is not valid",
//     ],
//   },
//   address: addressSchema,
//   phone: { type:[phoneSchema], null: true },
//   roles:{type:[String], null:true},
//   products: { type: [productSchema], null: true  }
// },
// { 
//   collection: 'users',
//   timestamps: true 
// });
