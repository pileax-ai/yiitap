/**
 * Extensions Registry Factory
 */

import type {
  // Tiptap
  AnyExtension,
  BackgroundColorOptions,
  BlockMathOptions,
  CollaborationOptions,
  CollaborationCaretOptions,
  ColorOptions,
  FocusOptions,
  FontFamilyOptions,
  HighlightOptions,
  HorizontalRuleOptions,
  ImageOptions,
  InlineMathOptions,
  LinkOptions,
  MarkdownExtensionOptions,
  MentionOptions,
  SubscriptExtensionOptions,
  SuperscriptExtensionOptions,
  TaskItemOptions,
  TaskListOptions,
  TextAlignOptions,
  TextStyleOptions,
  TypographyOptions,
  UnderlineOptions,
  UniqueIDOptions,

  // Yiitap
  AiBlockOptions,
  CalloutOptions,
  OBlockquoteOptions,
  OCodeBlockOptions,
  ODetailsOptions,
  OHeadingOptions,
  ParagraphOptions,
  ShortcutOptions,
} from './extensions'

// ---------------------------------------------------------
// YiiEditor extension imports
// ---------------------------------------------------------
import {
  // Tiptap
  BackgroundColor,
  BlockMath,
  Collaboration,
  CollaborationCaret,
  Color,
  DetailsContent,
  DetailsSummary,
  Focus,
  FontFamily,
  Highlight,
  Image,
  InlineMath,
  Link,
  Markdown,
  Mention,
  Subscript,
  Superscript,
  TaskList,
  TextAlign,
  Typography,
  Underline,
  UniqueID,
  TextStyle,
  Table,
  TableHeader,
  TableCell,
  TableRow,

  // Yiitap
  OAiBlock,
  OBlockMath,
  OBlockquote,
  OCallout,
  OCodeBlock,
  OColorHighlighter,
  OColonCommand,
  ODetails,
  OHeading,
  OHorizontalRule,
  OImage,
  OInlinePlaceholder,
  OLink,
  OParagraph,
  OSelectionDecoration,
  OShortcut,
  OSlashCommand,
  OSlashZhCommand,
  OTable,
  OTableCell,
  OTableHeader,
  OTableWrapper,
  OTaskItem,
  OVideo,

  // Suggestions
  ColonSuggestion,
  SlashSuggestion,
  EmojiSuggestion,
} from './extensions'

// ---------------------------------------------------------
// Factory
// ---------------------------------------------------------
/**
 * Define the factory type to hide internal Tiptap/Yiitap option types.
 * This prevents "name from external module" errors.
 */
type ExtensionFactory<K extends keyof ExtensionOptions = any> = (
  opts?: ExtensionOptions[K]
) => AnyExtension | AnyExtension[]

/**
 * Detailed options for each extension to provide full IntelliSense
 */
export interface ExtensionOptions {
  // Tiptap Defaults
  BackgroundColor: BackgroundColorOptions
  BlockMath: BlockMathOptions
  Collaboration: CollaborationOptions
  CollaborationCaret: CollaborationCaretOptions
  Color: ColorOptions
  Focus: FocusOptions
  FontFamily: FontFamilyOptions
  Highlight: HighlightOptions
  Image: ImageOptions
  InlineMath: InlineMathOptions
  Link: LinkOptions
  Markdown: MarkdownExtensionOptions
  Mention: MentionOptions
  Subscript: SubscriptExtensionOptions
  Superscript: SuperscriptExtensionOptions
  TaskItem: TaskItemOptions
  TaskList: TaskListOptions
  TextAlign: TextAlignOptions
  TextStyle: TextStyleOptions
  Typography: TypographyOptions
  Underline: UnderlineOptions
  UniqueID: UniqueIDOptions

  // Yiitap Custom Extensions
  OAiBlock: AiBlockOptions
  OBlockMath: BlockMathOptions
  OColon: { suggestion?: any; HTMLAttributes?: Record<string, any> }
  OSlash: { suggestion?: any; HTMLAttributes?: Record<string, any> }
  OSlashZh: { suggestion?: any; HTMLAttributes?: Record<string, any> }
  OBlockquote: OBlockquoteOptions
  OCallout: CalloutOptions
  OCodeBlock: OCodeBlockOptions
  OColorHighlighter: any
  OHeading: OHeadingOptions
  OHorizontalRule: HorizontalRuleOptions
  OImage: ImageOptions
  OInlinePlaceholder: { char?: string; HTMLAttributes?: Record<string, any> }
  OLink: LinkOptions
  OParagraph: ParagraphOptions
  OShortcut: ShortcutOptions
  OSelectionDecoration: any
  OVideo: { allowFullscreen?: boolean; HTMLAttributes?: Record<string, any> }

  // Groups
  ODetails: ODetailsOptions
  OTable: {
    resizable?: boolean
    handleWidth?: number
    cellMinWidth?: number
    HTMLAttributes?: Record<string, any>
  }

  // This index signature allows using ExtensionName to index this interface
  [key: string]: any
}

/**
 * Extension Factory Registry
 * Stores functions that return a configured extension instance
 */
export const extensionRegistry: {
  [K in keyof ExtensionOptions]?: ExtensionFactory<K>
} = {
  // Tiptap
  BackgroundColor: (opts?) =>
    BackgroundColor.configure({ types: ['textStyle'], ...opts }),
  BlockMath: (opts?) => BlockMath.configure(opts),
  Collaboration: (opts?) => Collaboration.configure(opts),
  CollaborationCaret: (opts?) => CollaborationCaret.configure(opts),
  Color: (opts?) => Color.configure(opts),
  Focus: (opts?) => Focus.configure(opts),
  FontFamily: (opts?) => FontFamily.configure(opts),
  Highlight: (opts?) => Highlight.configure({ multicolor: true, ...opts }),
  Image: (opts?) => Image.configure(opts),
  InlineMath: (opts?) => InlineMath.configure(opts),
  Link: (opts?) => Link.configure(opts),
  Markdown: (opts?: ExtensionOptions['Markdown']) =>
    Markdown.configure({
      indentation: { style: 'space', size: 2 },
      markedOptions: { gfm: true, breaks: true, pedantic: false },
      ...opts,
    }),
  Subscript: (opts?) => Subscript.configure(opts),
  Superscript: (opts?) => Superscript.configure(opts),
  TaskItem: (opts?) => OTaskItem.configure(opts),
  TaskList: (opts?) =>
    TaskList.configure({ itemTypeName: 'taskItem', ...opts }),
  TextAlign: (opts?) =>
    TextAlign.configure({ types: ['heading', 'paragraph'], ...opts }),
  TextStyle: (opts?) => TextStyle.configure(opts),
  Typography: (opts?) => Typography.configure(opts),
  Underline: (opts?) => Underline.configure(opts),
  UniqueID: (opts?) =>
    UniqueID.configure({
      attributeName: 'id',
      types: [
        'blockquote',
        'codeBlock',
        'callout',
        'heading',
        'image',
        'paragraph',
        'table-wrapper',
        'video',
      ],
      ...opts,
    }),

  // Yiitap
  OAiBlock: (opts?) => OAiBlock.configure(opts),
  OBlockMath: (opts?) => OBlockMath.configure(opts),
  OColon: (opts?) =>
    OColonCommand.configure({ suggestion: ColonSuggestion, ...opts }),
  OSlash: (opts?) =>
    OSlashCommand.configure({ suggestion: SlashSuggestion, ...opts }),
  OSlashZh: (opts?) =>
    OSlashZhCommand.configure({ suggestion: SlashSuggestion, ...opts }),
  OBlockquote: (opts?) =>
    OBlockquote.configure({ triggerCharacters: ['"', '“', '”'], ...opts }),
  OCallout: (opts?) => OCallout.configure(opts),
  OCodeBlock: (opts?) => OCodeBlock.configure(opts),
  OColorHighlighter: (opts?) => OColorHighlighter.configure(opts),
  OHeading: (opts?) => OHeading.configure(opts),
  OHorizontalRule: (opts?) => OHorizontalRule.configure(opts),
  OImage: (opts?) => OImage.configure(opts),
  OInlinePlaceholder: (opts?) => OInlinePlaceholder.configure(opts),
  OLink: (opts?) => OLink.configure({ openOnClick: false, ...opts }),
  OParagraph: (opts?) => OParagraph.configure(opts),
  OSelectionDecoration: (opts?) => OSelectionDecoration.configure(opts),
  OShortcut: (opts?) => OShortcut.configure(opts),
  OVideo: (opts?) => OVideo.configure(opts),

  // Groups (returning arrays)
  Table: (opts?) => [
    Table.configure({ resizable: true, ...opts }),
    TableRow,
    TableHeader,
    TableCell,
  ],
  ODetails: (opts?) => [
    ODetails.configure({
      persist: true,
      HTMLAttributes: { class: 'details' },
      ...opts,
    }),
    DetailsContent,
    DetailsSummary,
  ],
  OTable: (opts?) => [
    OTableWrapper,
    OTable.configure({ resizable: true, ...opts }),
    TableRow,
    OTableHeader,
    OTableCell,
  ],
} as const

/**
 * Derived Types for IntelliSense
 */
export type ExtensionName = keyof typeof extensionRegistry

/**
 * A unified structure combining Name and its specific Config
 */
export type ExtensionItem<T extends ExtensionName = ExtensionName> = {
  name: T
  configure?: T extends keyof ExtensionOptions
    ? Partial<ExtensionOptions[T]>
    : any
}

/**
 * Custom Type Guard to check if an item is a Tiptap Extension instance
 */
export const isExtensionInstance = (item: any): item is AnyExtension => {
  return (
    typeof item === 'object' &&
    item !== null &&
    (item.type === 'extension' || item.type === 'node' || item.type === 'mark')
  )
}

/**
 * Create a single extension from a unified item object
 * @param item - An object containing both name and optional config
 */
export const createExtension = <T extends ExtensionName>(
  item: ExtensionItem<T>
) => {
  const { name, configure } = item
  const factory = extensionRegistry[name]

  if (!factory) {
    console.warn(
      `[YiiEditor] Extension factory for "${String(name)}" not found.`
    )
    return null
  }

  // Pass the integrated config to the factory
  return factory(configure)
}
/**
 * Create a flattened list from a mix of names and configured items
 * Allows passing either a simple string or a full { name, configure } object
 */
export const createExtensionList = (
  items: (ExtensionName | ExtensionItem)[]
): AnyExtension[] => {
  return items.flatMap((item) => {
    // 1. If it's an array (e.g., OStarterKit.configure())
    if (Array.isArray(item)) {
      // Recursively flatten to handle nested arrays of extensions
      return createExtensionList(item)
    }

    // 2. If it's already an extension instance
    if (isExtensionInstance(item)) {
      return item
    }

    // 3. If it's a string name
    if (typeof item === 'string') {
      return createExtension({ name: item as ExtensionName }) ?? []
    }

    // 4. If it's a configuration object
    if (typeof item === 'object' && item !== null && 'name' in item) {
      return createExtension(item as ExtensionItem<any>) ?? []
    }

    return []
  })
}
