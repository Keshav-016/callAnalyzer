import { BigQuery } from '@google-cloud/bigquery';
import { CallTranscript, AnalyzedCall, CallsQuery } from '../types/index.js';
import env from '../utils/Env.js';

class BigqueryService {
  private readonly bigqueryClient: BigQuery | null;
  private readonly dataset: string;
  private readonly calls: CallTranscript[] = [];
  private readonly analyses: AnalyzedCall[] = [];

  constructor() {
    try {
      this.bigqueryClient = new BigQuery();
      console.log('[BigQuery] Client initialized');
    } catch (e) {
      console.error('[BigQuery] Failed to initialize client:', e);
      this.bigqueryClient = null;
    }
    this.dataset = env.BIGQUERY_DATASET;
  }
  insertCallTranscript = async (record: CallTranscript): Promise<{ ok: boolean }> => {
    if (this.bigqueryClient && this.dataset) {
      try {
        const dataset = this.bigqueryClient.dataset(this.dataset);
        const table = dataset.table('call_transcripts');
        await table.insert(record);
        console.log(`[BigQuery] Call transcript inserted: ${record.call_id}`);
        return { ok: true };
      } catch (err) {
        const error = err as Error;
        console.error('[BigQuery] Failed to insert call transcript:', error.message);
        console.log(`[Fallback] Using in-memory storage for call: ${record.call_id}`);
        this.calls.push(record);
        return { ok: true };
      }
    }
    this.calls.push(record);
    return { ok: true };
  };

  insertAnalyzedCall = async (record: AnalyzedCall): Promise<{ ok: boolean }> => {
    if (this.bigqueryClient && this.dataset) {
      try {
        const dataset = this.bigqueryClient.dataset(this.dataset);
        const table = dataset.table('analysed_calls');
        const { call_id, summary, category, sentiment, score, improvements } = record;
        await table.insert({ call_id, summary, category, sentiment, score, improvements });
        console.log(`[BigQuery] Analysis inserted: ${record.call_id}`);
        return { ok: true };
      } catch (err) {
        const error = err as Error;
        console.error('[BigQuery] Failed to insert analysis:', error.message);
        console.log(`[Fallback] Using in-memory storage for analysis: ${record.call_id}`);
        this.analyses.push(record);
        return { ok: true };
      }
    }
    this.analyses.push(record);
    return { ok: true };
  };

  queryCalls = async ({ agent_id, limit = 50 }: CallsQuery): Promise<CallTranscript[]> => {
    if (this.bigqueryClient && this.dataset) {
      // Simple query for demo; users should implement parameterized queries
      const sql = `SELECT * FROM \`${env.GCP_PROJECT_ID}.${this.dataset}.call_transcripts\` ORDER BY created_at DESC LIMIT @limit`;
      const options = { query: sql, params: { limit: Number(limit) } };
      const [job] = await this.bigqueryClient.createQueryJob(options);
      const [rows] = await job.getQueryResults();
      return rows as CallTranscript[];
    }
    return this.calls.filter((c) => !agent_id || c.agent_id === agent_id).slice(0, limit);
  };

  getCallById = async (call_id: string): Promise<CallTranscript | undefined> => {
    if (this.bigqueryClient && this.dataset) {
      const sql = `SELECT * FROM \`${env.GCP_PROJECT_ID}.${this.dataset}.call_transcripts\` WHERE call_id='${call_id}' LIMIT 1`;
      const [job] = await this.bigqueryClient.createQueryJob({ query: sql });
      const [rows] = await job.getQueryResults();
      return rows[0] as CallTranscript | undefined;
    }
    return this.calls.find((c) => c.call_id === call_id);
  };

  getAnalysisByCallId = async (call_id: string): Promise<AnalyzedCall | undefined> => {
    if (this.bigqueryClient && this.dataset) {
      const sql = `SELECT * FROM \`${env.GCP_PROJECT_ID}.${this.dataset}.analysed_calls\` WHERE call_id='${call_id}' LIMIT 1`;
      const [job] = await this.bigqueryClient.createQueryJob({ query: sql });
      const [rows] = await job.getQueryResults();
      return rows[0] as AnalyzedCall | undefined;
    }
    return this.analyses.find((a) => a.call_id === call_id);
  };
}

export default new BigqueryService();
