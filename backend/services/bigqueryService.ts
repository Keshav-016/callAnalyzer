import { BigQuery } from '@google-cloud/bigquery';
import { CallTranscript, AnalyzedCall, CallsQuery } from '../types/index.js';

let bigqueryClient: BigQuery | null;
try {
  bigqueryClient = new BigQuery();
} catch (e) {
  bigqueryClient = null;
}

const DATASET = process.env.BIGQUERY_DATASET;

// In-memory fallback
const _calls: CallTranscript[] = [];
const _analyses: AnalyzedCall[] = [];

export const insertCallTranscript = async (record: CallTranscript): Promise<{ ok: boolean }> => {
  if (bigqueryClient && DATASET) {
    const dataset = bigqueryClient.dataset(DATASET);
    const table = dataset.table('call_transcripts');
    await table.insert(record);
    return { ok: true };
  }
  _calls.push(record);
  return { ok: true };
};

export const insertAnalyzedCall = async (record: AnalyzedCall): Promise<{ ok: boolean }> => {
  if (bigqueryClient && DATASET) {
    const dataset = bigqueryClient.dataset(DATASET);
    const table = dataset.table('analysed_calls');
    await table.insert(record);
    return { ok: true };
  }
  _analyses.push(record);
  return { ok: true };
};

export const queryCalls = async ({
  agent_id,
  limit = 50,
}: CallsQuery): Promise<CallTranscript[]> => {
  if (bigqueryClient && DATASET) {
    // Simple query for demo; users should implement parameterized queries
    const sql = `SELECT * FROM \`${process.env.GCP_PROJECT_ID}.${DATASET}.call_transcripts\` ORDER BY created_at DESC LIMIT @limit`;
    const options = { query: sql, params: { limit: Number(limit) } };
    const [job] = await bigqueryClient.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    return rows as CallTranscript[];
  }
  return _calls.filter((c) => !agent_id || c.agent_id === agent_id).slice(0, limit);
};

export const getCallById = async (call_id: string): Promise<CallTranscript | undefined> => {
  if (bigqueryClient && DATASET) {
    const sql = `SELECT * FROM \`${process.env.GCP_PROJECT_ID}.${DATASET}.call_transcripts\` WHERE call_id='${call_id}' LIMIT 1`;
    const [job] = await bigqueryClient.createQueryJob({ query: sql });
    const [rows] = await job.getQueryResults();
    return rows[0] as CallTranscript | undefined;
  }
  return _calls.find((c) => c.call_id === call_id);
};

export const getAnalysisByCallId = async (call_id: string): Promise<AnalyzedCall | undefined> => {
  if (bigqueryClient && DATASET) {
    const sql = `SELECT * FROM \`${process.env.GCP_PROJECT_ID}.${DATASET}.analysed_calls\` WHERE call_id='${call_id}' LIMIT 1`;
    const [job] = await bigqueryClient.createQueryJob({ query: sql });
    const [rows] = await job.getQueryResults();
    return rows[0] as AnalyzedCall | undefined;
  }
  return _analyses.find((a) => a.call_id === call_id);
};

export default {
  insertCallTranscript,
  insertAnalyzedCall,
  queryCalls,
  getCallById,
  getAnalysisByCallId,
};
