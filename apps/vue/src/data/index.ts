import { BasicFeaturesArticle, BasicFeaturesArticleZh } from './article'
import { Audio, AudioZh } from './audio'
import { Diagram } from './diagram'
import { Image, ImageZh } from './image'
import { ModelViewer, ModelViewerZh } from './model-viewer'
import { MultiColumn, MultiColumnZh } from './multi-column'
import { Table, TableZh } from './table'

const CONTENT_MAP: Record<string, { en: string; zh: string }> = {
  empty: { en: '', zh: '' },
  audio: { en: Audio, zh: AudioZh },
  diagram: { en: Diagram, zh: Diagram },
  image: { en: Image, zh: ImageZh },
  modelViewer: { en: ModelViewer, zh: ModelViewerZh },
  multiColumn: { en: MultiColumn, zh: MultiColumnZh },
  table: { en: Table, zh: TableZh },
}

const DEFAULT_CONTENT = {
  en: BasicFeaturesArticle,
  zh: BasicFeaturesArticleZh,
}

export const getData = (name = 'all', locale: 'en' | 'zh' = 'en') => {
  if (locale.startsWith('en')) locale = 'en'
  if (locale.startsWith('zh')) locale = 'zh'

  const source = CONTENT_MAP[name] || DEFAULT_CONTENT
  return source[locale] ?? DEFAULT_CONTENT[locale] ?? DEFAULT_CONTENT['en']
}
