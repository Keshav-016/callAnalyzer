import mongoose from 'mongoose';
import { AgentType } from '../types';

const agentSchema = new mongoose.Schema<AgentType>(
  {
    agent_id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      index: true,
    },

    department: {
      type: String,
      required: false,
      default: 'General',
      index: true,
    },

    joining_date: {
      type: String,
      required: false,
      default: () => new Date().toISOString().slice(0, 10),
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);
agentSchema.index({ department: 1, joining_date: -1 });

export const Agent = mongoose.model('agents', agentSchema);
