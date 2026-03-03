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
  insertCallTranscript = async (record: CallTranscriptType): Promise<{ ok: boolean }> => {
    try {
      await TranscriptCall.insertOne(record);
      return { ok: true };
    } catch (err) {
      console.error('[MongoDB] Failed to insert call transcript:', (err as Error).message);
      return { ok: false };
    }
  };
  updateCallTranscript = async (record: UpdateCallTranscriptType): Promise<{ ok: boolean }> => {
    try {
      await TranscriptCall.updateOne({ call_id: record.call_id }, { $set: record });
      return { ok: true };
    } catch (err) {
      console.error('[MongoDB] Failed to insert call transcript:', (err as Error).message);
      return { ok: false };
    }
  };

  insertAnalyzedCall = async (record: AnalyzedCallType): Promise<{ ok: boolean }> => {
    try {
      await AnalyzedCall.insertOne(record);
      return { ok: true };
    } catch (err) {
      console.error('[MongoDB] Failed to insert analysis:', (err as Error).message);
      return { ok: false };
    }
  };

  insertAgent = async (record: AgentType): Promise<{ ok: boolean }> => {
    try {
      await Agent.updateOne(
        { agent_id: record.agent_id },
        { $setOnInsert: record },
        { upsert: true },
      );
      return { ok: true };
    } catch (err) {
      console.error('[MongoDB] Failed to insert agent:', (err as Error).message);
      return { ok: false };
    }
  };

  getAgentById = async (id: string): Promise<UserType | undefined> => {
    const agent = await Agent.findOne({ agent_id: id });
    if (!agent?.password) return undefined;
    return { id: agent.agent_id, name: agent.name, passwordHash: agent.password };
  };

  queryCalls = async ({ agent_id, limit = 50 }: CallsQueryType): Promise<CallTranscriptType[]> => {
    const query = agent_id ? { agent_id } : {};
    const rows = await TranscriptCall.find(query).sort({ created_at: -1 }).limit(Number(limit));

    return rows;
  };

  getCallById = async (call_id: string): Promise<CallTranscriptType | undefined> => {
    const row = await TranscriptCall.findOne({ call_id });
    return row ?? undefined;
  };

  getAnalysisByCallId = async (call_id: string): Promise<AnalyzedCallType | undefined> => {
    const row = await AnalyzedCall.findOne({ call_id });
    return row ?? undefined;
  };
}

export default new MongodbService();
