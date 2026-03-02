import mongoose from 'mongoose';
import { CallTranscriptType } from '../types';

const transcriptCallSchema = new mongoose.Schema<CallTranscriptType>(
  {
    call_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    agent_id: {
      type: String,
      required: true,
      index: true,
      ref: 'agents', // optional reference
    },

    audio_path: {
      type: String,
      required: true,
    },

    transcript: {
      type: String,
    },

    duration: {
      type: Number,
      min: 0,
    },

    analyzed: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Important dashboard indexes
transcriptCallSchema.index({ agent_id: 1, created_at: -1 });

export const TranscriptCall = mongoose.model('transcript_calls', transcriptCallSchema);
