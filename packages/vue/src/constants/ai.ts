/**
 * AI
 */
export const AiProviders: Indexable = {
  deepseek: {
    baseURL: 'https://api.deepseek.com/v1',
    name: 'DeepSeek',
  },
  openai: {
    baseURL: 'https://api.openai.com/v1',
    name: 'OpenAI',
  },
}

export const getProviderProp = (name: string, prop: string) => {
  const provider = AiProviders[name]
  return provider ? provider[prop] : null
}

const WRITING_PROMPT = `
# Role
World-class Writing Expert and Editor.

# Core Task
Rewrite and optimize the user's input for clarity, flow, and impact while strictly adhering to the specified language and tone.

# Constraints
- Language: Respond ONLY in the language specified by: [LANG_CODE].
- Formatting: Use Markdown for structure.
- Output: Provide the optimized text directly. Do not include any meta-talk, explanations, suggestions, or introductory/concluding remarks.
`

export const Prompts: Indexable = {
  writing: WRITING_PROMPT,
}
