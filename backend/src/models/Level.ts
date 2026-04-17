import mongoose, { Schema, Document } from 'mongoose';

export interface ILevel extends Document {
  levelNumber: number;
  subject: 'math' | 'english' | 'gk';
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  minValue: number;
  maxValue: number;
  questionTemplate: string;
  xpReward: number;
  coinsReward: number;
  unlockCondition: {
    previousLevel: number;
  };
}

const LevelSchema: Schema = new Schema({
  levelNumber: { type: Number, required: true },
  subject: { type: String, enum: ['math', 'english', 'gk'], required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  minValue: { type: Number, required: true },
  maxValue: { type: Number, required: true },
  questionTemplate: { type: String, required: true }, // e.g., 'addition-basic'
  xpReward: { type: Number, default: 50 },
  coinsReward: { type: Number, default: 20 },
  unlockCondition: {
    previousLevel: { type: Number, default: 0 }
  }
});

LevelSchema.index({ levelNumber: 1, subject: 1 }, { unique: true });

export default mongoose.model<ILevel>('Level', LevelSchema);
