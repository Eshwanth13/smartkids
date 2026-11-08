import mongoose, { Schema, Document } from 'mongoose';

export interface IAiInsight extends Document {
  childId: mongoose.Types.ObjectId;
  insight: {
    summary: string;
    strengths: string[];
    areasToImprove: string[];
    suggestedActions: string[];
    encouragement: string;
  };
  source: 'ai' | 'rule-based';
  modelUsed?: string;
  statsHash: string;
  generatedAt: Date;
}

const AiInsightSchema: Schema = new Schema({
  childId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  insight: {
    summary: { type: String, required: true },
    strengths: [{ type: String }],
    areasToImprove: [{ type: String }],
    suggestedActions: [{ type: String }],
    encouragement: { type: String, required: true },
  },
  source: { type: String, enum: ['ai', 'rule-based'], required: true },
  modelUsed: { type: String },
  statsHash: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAiInsight>('AiInsight', AiInsightSchema);
