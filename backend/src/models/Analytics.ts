import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  userId: mongoose.Types.ObjectId;
  levelId?: mongoose.Types.ObjectId;
  question?: string;
  userAnswer?: string;
  correctAnswer?: string;
  isCorrect: boolean;
  timeTaken?: number;
  topic: string;
  subject: string;
  difficulty?: string;
  createdAt: Date;
}

const AnalyticsSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  levelId: { type: Schema.Types.ObjectId, ref: 'Level', required: false },
  question: { type: String, required: false },
  userAnswer: { type: String, required: false },
  correctAnswer: { type: String, required: false },
  isCorrect: { type: Boolean, required: true },
  timeTaken: { type: Number, required: false, default: 0 },
  topic: { type: String, required: true },
  subject: { type: String, required: true },
  difficulty: { type: String, required: false, default: 'medium' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
