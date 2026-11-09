import { flattenExtensions, generateText, type Extensions } from '@tiptap/core'

function extractNodeText(node: any) {
  if (!node || typeof node !== 'object') return ''

  // If it's a text node, return its text value
  if (node.type === 'text' && typeof node.text === 'string') {
    return node.text
  }

  // If it has child nodes, recursively extract and concatenate their text
  if (Array.isArray(node.content)) {
    return node.content.map((child: any) => extractNodeText(child)).join(' ')
  }

  return ''
}

/**
 * Recursively sanitizes JSON content for Tiptap, replacing or removing
 * unknown node types that lack registered extensions.
 * @param node Node
 * @param supportedNodes Supported nodes
 */
export function sanitizeUnsupportedNodes(
  node: any,
  supportedNodes: string[]
): any {
  if (!node || typeof node !== 'object') return node

  // If the node type is not supported by current extensions, provide a fallback
  if (node.type && !supportedNodes.includes(node.type)) {
    let nodeText = extractNodeText(node)

    return {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: `[Unsupported Content: <<${node.type}>> ${nodeText}]`,
          marks: [
            {
              type: 'textStyle',
              attrs: { color: '#CB912F' },
            },
          ],
        },
      ],
    }
  }

  // Recursively sanitize child nodes
  if (node.content && Array.isArray(node.content)) {
    node.content = node.content
      .map((child: any) => sanitizeUnsupportedNodes(child, supportedNodes))
      .filter(Boolean)
  }

  return node
}

/**
 * Recursively sanitizes JSON content for Tiptap based on installed extensions
 * @param node Node
 * @param installedExtensions Installed extensions
 */
export function sanitizeNodes(node: any, installedExtensions: Extensions) {
  const allExtensions = flattenExtensions(installedExtensions)
  const supportedNodes = allExtensions
    .filter((ext: any) => ext.type === 'node')
    .map((ext: any) => ext.name)

  return sanitizeUnsupportedNodes(node, supportedNodes)
}
