import mongoose from 'mongoose';

export interface UserInterface {
  _id?: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  age: number;
}
