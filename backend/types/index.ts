export interface User {
  id: string;
  name: string;
  passwordHash: string;
}

export interface UserResponse {
  id: string;
  name: string;
}

export interface AuthPayload {
  sub: string;
  name: string;
  iat?: number;
  exp?: number;
}

export interface LoginRequest {
  agent_id: string;
  password: string;
}

export interface RegisterRequest {
  agent_id: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface CallTranscript {
  call_id: string;
  agent_id: string;
  file_path: string;
  transcript?: string;
  created_at: string;
  analyzed: boolean;
}

export interface AnalyzedCall {
  call_id: string;
  summary: string;
  category: string;
  sentiment: string;
  score: number;
  improvements: string[];
  analyzed_at: string;
}

export interface AnalysisResult {
  summary: string;
  category: string;
  sentiment: string;
  score: number;
  improvements: string[];
}

export interface UploadResponse {
  call_id: string;
}

export interface CallsQuery {
  agent_id?: string;
  limit?: number;
}

export interface PubSubMessage {
  call_id: string;
  agent_id: string;
  file_path: string;
}

export interface PubSubResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

export interface QueryOptions {
  query: string;
  params?: Record<string, unknown>;
}
