import { type Extensions, flattenExtensions } from '@tiptap/core'

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
    return {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: `[Unsupported Content: ${node.type}]`,
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
  console.log('supportedNodes', supportedNodes)

  return sanitizeUnsupportedNodes(node, supportedNodes)
}
