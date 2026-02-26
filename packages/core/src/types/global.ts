declare global {
  type Indexable<T = any> = {
    [key: string]: T
  }

  interface KeyValue {
    key: string
    value: any
  }

  interface OptionValue {
    label: string
    value: string | number
    name?: string
    icon?: string
  }

  interface BlockOption {
    label: string
    value: string
    keywords?: string
    icon?: string
    color?: string
    tips?: string
    group?: string
    filter?: string
    style?: boolean
    options?: Indexable
    component?: string
    children?: BlockOption[]
  }

  interface EditorImage {
    pos: number
    attrs: Record<string, any>
  }
}
export {}
