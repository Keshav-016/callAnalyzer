import mongoose from 'mongoose';
import { AnalyzedCallType } from '../types/index.js';

export const ANALYZED_CALLS_COLLECTION = 'analyzed_calls';

const analyzedCallSchema = new mongoose.Schema<AnalyzedCallType>(
  {
    call_id: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },

    summary: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    sentiment: {
      type: String,
      required: true,
      enum: ['Positive', 'Neutral', 'Negative'],
      index: true,
    },

    score: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
      index: true,
    },

    improvements: {
      type: [String],
      required: true,
      default: [],
    },

    analyzed_at: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false, // since you already have analyzed_at
    versionKey: false,
  },
);

export const AnalyzedCall = mongoose.model('analyzed_calls', analyzedCallSchema);
