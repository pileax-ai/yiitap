// ---------------------------------------------------------
// Tiptap extensions imports
// ---------------------------------------------------------
import type { AnyExtension } from '@tiptap/core'
import { Focus, type FocusOptions } from '@tiptap/extensions'
import {
  Details,
  DetailsContent,
  DetailsSummary,
} from '@tiptap/extension-details'
import {
  TaskItem,
  TaskList,
  type TaskItemOptions,
  type TaskListOptions,
} from '@tiptap/extension-list'
import {
  BlockMath,
  InlineMath,
  type BlockMathOptions,
  type InlineMathOptions,
} from '@tiptap/extension-mathematics'
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from '@tiptap/extension-table'
import {
  BackgroundColor,
  Color,
  FontFamily,
  TextStyle,
  type BackgroundColorOptions,
  type ColorOptions,
  type FontFamilyOptions,
  type TextStyleOptions,
} from '@tiptap/extension-text-style'
import { Markdown, type MarkdownExtensionOptions } from '@tiptap/markdown'
import Collaboration, {
  type CollaborationOptions,
} from '@tiptap/extension-collaboration'
import CollaborationCaret, {
  type CollaborationCaretOptions,
} from '@tiptap/extension-collaboration-caret'
import Highlight, { type HighlightOptions } from '@tiptap/extension-highlight'
import { type HorizontalRuleOptions } from '@tiptap/extension-horizontal-rule'
import Image, { type ImageOptions } from '@tiptap/extension-image'
import Link, { type LinkOptions } from '@tiptap/extension-link'
import Mention, { type MentionOptions } from '@tiptap/extension-mention'
import Subscript, {
  type SubscriptExtensionOptions,
} from '@tiptap/extension-subscript'
import Superscript, {
  type SuperscriptExtensionOptions,
} from '@tiptap/extension-superscript'
import TextAlign, { type TextAlignOptions } from '@tiptap/extension-text-align'
import Typography, {
  type TypographyOptions,
} from '@tiptap/extension-typography'
import Underline, { type UnderlineOptions } from '@tiptap/extension-underline'
import UniqueID, { type UniqueIDOptions } from '@tiptap/extension-unique-id'

// ---------------------------------------------------------
// YiiEditor extension imports
// ---------------------------------------------------------
// Extension lib
import type { AiBlockOptions } from '@yiitap/extension-ai-block'
import type { CalloutOptions } from '@yiitap/extension-callout'
import OColorHighlighter from '@yiitap/extension-color-highlighter'
import OInlinePlaceholder from '@yiitap/extension-inline-placeholder'
import {
  Column,
  ColumnContainer,
  MultiColumn,
  ColumnDropCursor,
} from '@yiitap/extension-multi-column'
import type {
  MultiColumnOptions,
  ColumnDropCursorOptions,
} from '@yiitap/extension-multi-column'
import OPlaceholder from '@yiitap/extension-placeholder'
import OSelectionDecoration from '@yiitap/extension-selection-decoration'
import OShortcut, { type ShortcutOptions } from '@yiitap/extension-shortcut'
import OTable from '@yiitap/extension-table'
import OTaskItem from '@yiitap/extension-task-item'

import OCharCommand from '@yiitap/extension-char-command'
import {
  ColonCommand as OColonCommand,
  SlashCommand as OSlashCommand,
  SlashZhCommand as OSlashZhCommand,
} from '@yiitap/extension-char-command'
import {
  ColonSuggestion,
  SlashSuggestion,
  EmojiSuggestion,
} from './char-command'

// Extension local
import OAiBlock from './ai-block'
import OAudio, { type AudioOptions } from './audio'
import OBlockMath from './block-math'
import OBlockquote, { type OBlockquoteOptions } from './blockquote'
import OCallout from './callout'
import OCodeBlock, { type OCodeBlockOptions } from './code-block'
import ODetails, { type ODetailsOptions } from './details'
import OHorizontalRule from './horizontal-rule'
import OImage from './image'
import OLink from './link'
import OModelViewer from './model-viewer'
import OTableCell from './table-cell'
import OTableHeader from './table-header'
import OTableWrapper from './table-wrapper'
import OVideo from './video'

// ---------------------------------------------------------
// Extensions
// ---------------------------------------------------------
/**
 * Default extensions enabled via StarterKit
 */
export const DefaultExtensionNames = [
  'BackgroundColor',
  'Color',
  'Focus',
  'FontFamily',
  'Highlight',
  'Subscript',
  'Superscript',
  'TaskItem',
  'TaskList',
  'TextAlign',
  'TextStyle',
  'Typography',
  'UniqueID',

  'OBlockquote',
  'OCallout',
  'OCodeBlock',
  'OHorizontalRule',
  'OLink',
  'OSelectionDecoration',
  'OSlash',
  'OSlashZh',
  'OTable',
]

// --------------------------------------------------------------------------------
// Exposed Extension List
// --------------------------------------------------------------------------------
export {
  // Tiptap
  BackgroundColor,
  BlockMath,
  Collaboration,
  CollaborationCaret,
  Color,
  Details,
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
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TaskItem,
  TaskList,
  TextAlign,
  TextStyle,
  Typography,
  Underline,
  UniqueID,

  // Yiitap
  OAiBlock,
  OAudio,
  OBlockMath,
  OBlockquote,
  OCallout,
  OCharCommand,
  OCodeBlock,
  OColonCommand,
  OColorHighlighter,
  ODetails,
  OHorizontalRule,
  OImage,
  OInlinePlaceholder,
  OLink,
  OModelViewer,
  OPlaceholder,
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

  // Column
  Column,
  ColumnContainer,
  MultiColumn,
  ColumnDropCursor,

  // Suggestions
  ColonSuggestion,
  SlashSuggestion,
  EmojiSuggestion,
}

export type {
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
  AudioOptions,
  CalloutOptions,
  OBlockquoteOptions,
  OCodeBlockOptions,
  ODetailsOptions,
  ColumnDropCursorOptions,
  MultiColumnOptions,
  ShortcutOptions,
}
