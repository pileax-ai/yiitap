export interface AiProvider {
  provider: string
  modelName?: string
  modelType?: string
}

export type CompletionOptions = {
  messages: any[]
  onChunk: (chunk: string) => void
  options?: {
    id?: string
    type?: string
  }
}

export interface AiOptions {
  provider: AiProvider
  onStreamingChatCompletion?: ({
    messages,
    onChunk,
    options,
  }: CompletionOptions) => Promise<string>
}

export type ChatMessageRole = 'system' | 'user' | 'assistant'

export interface ChatMessage {
  role: ChatMessageRole
  content: string
}
