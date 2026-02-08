export interface ChatRequestMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatRequestMessage[];
}

export interface ChatResponse {
  message: string;
  error?: string;
}

export interface StreamChunk {
  type: 'text' | 'error' | 'done';
  content: string;
}
