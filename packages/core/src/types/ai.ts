export interface AiProvider {
  provider: string
  modelName?: string
  modelType?: string
}

export interface AiOptions {
  provider: AiProvider
  onStreamingChatCompletion?: (
    messages: any[],
    onChunk: (chunk: string) => void
  ) => Promise<string>
}

export type ChatMessageRole = 'system' | 'user' | 'assistant'

export interface ChatMessage {
  role: ChatMessageRole
  content: string
}
