/**
 * Empty Blocks
 */

export const EmptyParagraph = [
  {
    type: 'paragraph',
    content: [],
  },
]

export const EmptyAiBlock = {
  type: 'aiBlock',
  content: EmptyParagraph,
}

export const EmptyAudio = {
  type: 'audio',
  attrs: {
    src: '//init.mp3',
  },
}

export const EmptyBlockquote = {
  type: 'blockquote',
  content: EmptyParagraph,
}

export const EmptyCallout = {
  type: 'callout',
  attrs: {
    icon: '💡',
  },
  content: EmptyParagraph,
}

export const EmptyCodeblock = {
  type: 'codeBlock',
  attrs: {
    attrs: { language: 'shell' },
  },
  content: [],
}

export const EmptyDetails = {
  type: 'details',
  attrs: {
    open: false,
  },
  content: [
    {
      type: 'detailsSummary',
      content: [],
    },
    {
      type: 'detailsContent',
      content: EmptyParagraph,
    },
  ],
}

export const EmptyDiagram = {
  type: 'codeBlock',
  attrs: {
    language: 'mermaid',
  },
  content: [
    {
      type: 'text',
      text: 'graph TD\n' + '  Mermaid --> Diagram',
    },
  ],
}

export const EmptyEmoji = {
  type: 'paragraph',
  content: [{ type: 'text', text: ':' }],
}

export const EmptyImage = {
  type: 'image',
  attrs: {
    src: 'init',
  },
}

export const EmptyListItem = [
  {
    type: 'listItem',
    content: [
      {
        type: 'paragraph',
        content: [],
      },
    ],
  },
]

export const EmptyTable = {
  type: 'table',
  content: Array.from({ length: 3 }, () => ({
    type: 'tableRow',
    content: Array.from({ length: 3 }, () => ({
      type: 'tableCell',
      content: [{ type: 'paragraph' }], // Cells must contain at least one paragraph
    })),
  })),
}

export const EmptyTaskItem = [
  {
    type: 'taskItem',
    content: [
      {
        type: 'paragraph',
        content: [],
      },
    ],
  },
]

export const EmptyVideo = {
  type: 'video',
  attrs: {
    src: 'init',
  },
}
