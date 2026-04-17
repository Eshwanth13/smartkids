import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Level from '../models/Level';

dotenv.config();

const mathLevels = Array.from({ length: 10 }, (_, i) => ({
  levelNumber: i + 1,
  subject: 'math',
  topic: i < 3 ? 'Addition' : i < 5 ? 'Subtraction' : i < 7 ? 'Multiplication' : i < 9 ? 'Division' : 'BODMAS',
  difficulty: i < 4 ? 'beginner' : i < 8 ? 'intermediate' : 'advanced',
  minValue: 1,
  maxValue: (i + 1) * 10,
  questionTemplate: i < 3 ? 'addition' : i < 5 ? 'subtraction' : i < 7 ? 'multiplication' : i < 9 ? 'division' : 'bodmas',
  xpReward: 50 + (i * 10),
  coinsReward: 10 + (i * 5),
  unlockCondition: { previousLevel: i }
}));

const englishLevels = Array.from({ length: 10 }, (_, i) => ({
  levelNumber: i + 1,
  subject: 'english',
  topic: i < 3 ? 'Spelling' : i < 6 ? 'Vocabulary' : i < 9 ? 'Grammar' : 'Sentence Structure',
  difficulty: i < 4 ? 'beginner' : i < 8 ? 'intermediate' : 'advanced',
  minValue: 1,
  maxValue: 10,
  questionTemplate: i < 3 ? 'missing-letters' : i < 6 ? 'synonyms' : i < 9 ? 'articles' : 'correction',
  xpReward: 50 + (i * 10),
  coinsReward: 10 + (i * 5),
  unlockCondition: { previousLevel: i }
}));

const gkLevels = Array.from({ length: 10 }, (_, i) => ({
  levelNumber: i + 1,
  subject: 'gk',
  topic: i < 3 ? 'Animals' : i < 5 ? 'Solar System' : i < 7 ? 'Geography' : i < 9 ? 'India Facts' : 'Science',
  difficulty: i < 4 ? 'beginner' : i < 8 ? 'intermediate' : 'advanced',
  minValue: 1,
  maxValue: 10,
  questionTemplate: i < 3 ? 'animals' : i < 5 ? 'planets' : i < 7 ? 'capitals' : i < 9 ? 'symbols' : 'general',
  xpReward: 50 + (i * 10),
  coinsReward: 10 + (i * 5),
  unlockCondition: { previousLevel: i }
}));

const levels = [...mathLevels, ...englishLevels, ...gkLevels];

const seedDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartkids';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Drop legacy indexes that might conflict (specifically the unique levelNumber index)
    try {
      await mongoose.connection.db?.collection('levels').dropIndexes();
      console.log('Old indexes dropped.');
    } catch (e) {
      console.log('No indexes to drop or collection does not exist yet.');
    }

    await Level.deleteMany({});
    await Level.insertMany(levels);

    console.log('✅ 30 Levels (10 per subject) seeded successfully');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
