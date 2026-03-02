import mongoose from 'mongoose';
import { AgentType } from '../types';

const agentSchema = new mongoose.Schema<AgentType>(
  {
    agent_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    department: {
      type: String,
      required: true,
      index: true,
    },

    joining_date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

export const Agent = mongoose.model('agents', agentSchema);
