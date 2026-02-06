export type MessageSchema = {
  name?: string
  [key: string]: any
}

export type Messages = Record<string, MessageSchema>
