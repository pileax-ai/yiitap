import { ref, watch, onMounted, type Ref } from 'vue'
import OpenAI from 'openai'
import { type ChatMessage, type CompletionOptions } from '@yiitap/vue'
import { getProviderProp } from '../constants'

export default function () {
  const aiOption = ref<AiOption>({
    provider: 'deepseek',
    apiKey: '',
  })
  const sdk: Ref<OpenAI | null> = ref(null)

  function createSdk() {
    if (!aiOption.value) return

    const { provider, apiKey, baseURL } = aiOption.value
    const baseUrl = baseURL || getProviderProp(provider, 'baseURL')
    if (!provider || !apiKey || !baseUrl) return

    sdk.value = new OpenAI({
      apiKey: apiKey,
      baseURL: baseUrl,
      dangerouslyAllowBrowser: true,
    })
    // console.log('sdk', sdk.value)
  }

  const onStreamingChatCompletion = async ({
    messages,
    onChunk,
    options,
  }: CompletionOptions) => {
    // console.table(messages)
    // console.info('options', options)

    if (!sdk.value) {
      throw new Error('AI SDK is not initialized, please check AI options.')
    }

    try {
      const stream = await sdk.value?.chat.completions.create({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        stream: true,
      })

      let fullResponse = ''
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        fullResponse += content
        onChunk(content)
      }
      return fullResponse
    } catch (error: any) {
      console.error('API Error:', error)
      throw new Error(error.message || 'API request failed')
    }
  }

  watch(
    () => aiOption,
    (newValue) => {
      createSdk()
    },
    { deep: true }
  )

  onMounted(() => {
    createSdk()
  })

  return {
    aiOption,
    onStreamingChatCompletion,
  }
}
