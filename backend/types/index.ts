export interface UserType {
  id: string;
  name: string;
  passwordHash: string;
}

export interface AgentType {
  agent_id: string;
  name: string;
  email?: string;
  department?: string;
  joining_date?: string;
  password: string;
}

export interface UserResponseType {
  id: string;
  name: string;
}

export interface AuthPayloadType {
  sub: string;
  name: string;
  iat?: number;
  exp?: number;
}

export interface LoginRequestType {
  agent_id: string;
  password: string;
}

export interface RegisterRequestType {
  agent_id: string;
  name: string;
  password: string;
}

export interface AuthResponseType {
  token: string;
  user: UserResponseType;
}

export interface CallTranscriptType {
  call_id: string;
  agent_id: string;
  audio_path: string;
  transcript?: string;
  duration?: number;
  created_at: string;
  analyzed: boolean;
}

export interface UpdateCallTranscriptType {
  call_id: string;
  transcript?: string;
  duration?: number;
  analyzed: boolean;
}

export interface AnalyzedCallType {
  call_id: string;
  summary: string;
  category: string;
  sentiment: string;
  score: number;
  improvements: string[];
  analyzed_at?: Date;
}

export interface AnalysisResultType {
  summary: string;
  category: string;
  sentiment: string;
  score: number;
  improvements: string[];
}

export interface UploadResponseType {
  call_id: string;
}

export interface CallsQueryType {
  agent_id?: string;
  limit?: number;
}

export interface PubSubMessageType {
  call_id: string;
  agent_id: string;
  file_path: string;
}

export interface PubSubResultType {
  ok: boolean;
  messageId?: string;
  error?: string;
}

export interface QueryOptionsType {
  query: string;
  params?: Record<string, unknown>;
}
