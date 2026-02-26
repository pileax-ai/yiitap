declare global {
  interface AiOption {
    provider: string
    baseURL?: string
    apiKey: string
    config?: Indexable
  }
}
export {}
