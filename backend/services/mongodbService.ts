import {
  AgentType,
  AnalyzedCallType,
  CallTranscriptType,
  CallsQueryType,
  UpdateCallTranscriptType,
  UserType,
} from '../types/index.js';
import { AnalyzedCall } from '../model/analyzed_calls.js';
import { TranscriptCall } from '../model/transcriptCalls.js';
import { Agent } from '../model/agent.js';

class MongodbService {
  insertCallTranscript = async (record: CallTranscriptType): Promise<void> => {
    await TranscriptCall.create(record);
  };

  updateCallTranscript = async (record: UpdateCallTranscriptType): Promise<void> => {
    const { call_id, ...updates } = record;
    const payload = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined),
    );

    if (Object.keys(payload).length === 0) {
      return;
    }

    const result = await TranscriptCall.updateOne({ call_id }, { $set: payload }, { runValidators: true });
    if (result.matchedCount === 0) {
      throw new Error(`Call transcript not found: ${call_id}`);
    }
  };

  insertAnalyzedCall = async (record: AnalyzedCallType): Promise<void> => {
    await AnalyzedCall.updateOne(
      { call_id: record.call_id },
      {
        $setOnInsert: {
          ...record,
          analyzed_at: record.analyzed_at ?? new Date().toISOString(),
        },
      },
      { upsert: true, runValidators: true },
    );
  };

  insertAgent = async (record: AgentType): Promise<void> => {
    await Agent.create(record);
  };

  getAgentById = async (id: string): Promise<UserType | undefined> => {
    const agent = await Agent.findOne({ agent_id: id }).lean();
    if (!agent?.password) return undefined;
    return { id: agent.agent_id, name: agent.name, passwordHash: agent.password };
  };

  queryCalls = async ({ agent_id, limit = 50 }: CallsQueryType): Promise<CallTranscriptType[]> => {
    const safeLimit = Math.max(1, Math.min(Number(limit) || 50, 200));
    const query = agent_id ? { agent_id } : {};
    const rows = await TranscriptCall.find(query)
      .select('-_id')
      .sort({ created_at: -1 })
      .limit(safeLimit)
      .lean<CallTranscriptType[]>();
    return rows;
  };

  getCallById = async (call_id: string): Promise<CallTranscriptType | undefined> => {
    const row = await TranscriptCall.findOne({ call_id })
      .select('-_id')
      .lean<CallTranscriptType | null>();
    return row ?? undefined;
  };

  getAnalysisByCallId = async (call_id: string): Promise<AnalyzedCallType | undefined> => {
    const row = await AnalyzedCall.findOne({ call_id })
      .select('-_id')
      .lean<AnalyzedCallType | null>();
    return row ?? undefined;
  };
}

export default new MongodbService();
