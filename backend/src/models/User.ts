import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email?: string;
  password?: string;
  role: 'parent' | 'child';
  parentId?: mongoose.Types.ObjectId;
  pin?: string;
  avatar?: string;
  xp: number;
  coins: number;
  progress: {
    math: number;
    english: number;
    gk: number;
  };
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    unique: true, 
    sparse: true, // Only for parents
    lowercase: true 
  },
  password: { type: String }, // Hashed, for parents
  role: { type: String, enum: ['parent', 'child'], required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  pin: { type: String }, // 4-digit PIN for children
  avatar: { type: String, default: '/assets/mascot/zappy_happy.png' },
  xp: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  progress: {
    math: { type: Number, default: 1 },
    english: { type: Number, default: 1 },
    gk: { type: Number, default: 1 }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
