import mongoose from 'mongoose';
import {Schema, model} from 'mongoose';

const userSchema = new Schema({
  username: {type: String},
  password:{type: String},
  email:{type: String}
 
});

export const UserModel = model('User', userSchema);

const contentSchema = new Schema({
  title: String,
  description: String,
  link: String,
  userId:{type: Schema.Types.ObjectId, ref: 'User'},
  type: String

});

export const ContentModel = model('Content', contentSchema);