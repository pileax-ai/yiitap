import { Decoration, DecorationSet } from '@tiptap/pm/view'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

const makeSlugger = () => {
  const seen = new Map<string, number>()
  return (text: string) => {
    const base =
      text
        .toLowerCase()
        .trim()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'section'
    const n = (seen.get(base) || 0) + 1
    seen.set(base, n)
    return n === 1 ? base : `${base}-${n}`
  }
}

const outlineOf = (doc: ProseMirrorNode) => {
  const slugOf = makeSlugger()
  const out: {
    slug: string
    level: number
    pos: number
    node: ProseMirrorNode
  }[] = []
  doc.forEach((node, offset) => {
    if (node.type.name !== 'heading') return
    out.push({
      slug: slugOf(node.textContent),
      level: node.attrs.level || 1,
      pos: offset,
      node,
    })
  })
  return out
}

export const buildDecorations = (
  doc: ProseMirrorNode,
  collapsed: Set<string>,
  enabled: boolean = true
): DecorationSet => {
  if (!enabled) {
    return DecorationSet.empty
  }

  const decos: Decoration[] = []
  const headings = outlineOf(doc)

  // 1. Find the content range [contentStart, contentEnd) for each collapsed heading
  const hiddenRanges: { from: number; to: number }[] = []
  headings.forEach((h, i) => {
    if (!collapsed.has(h.slug)) return
    const contentStart = h.pos + h.node.nodeSize
    const next = headings.slice(i + 1).find((n) => n.level <= h.level)
    const contentEnd = next ? next.pos : doc.content.size
    hiddenRanges.push({ from: contentStart, to: contentEnd })
  })

  // 2. Inject arrow widgets and fold classes into all headings
  headings.forEach((h) => {
    const isCollapsed = collapsed.has(h.slug)
    const nodeEnd = h.pos + h.node.nodeSize

    decos.push(
      Decoration.node(h.pos, nodeEnd, {
        class: `cw-heading${isCollapsed ? ' cw-collapsed' : ''}`,
        'data-anchor': h.slug,
      })
    )

    decos.push(
      Decoration.widget(
        h.pos + 1,
        () => {
          const btn = document.createElement('button')
          btn.className = 'cw-fold-btn'
          btn.type = 'button'
          btn.dataset.slug = h.slug
          btn.setAttribute(
            'aria-label',
            isCollapsed ? 'Expand section' : 'Collapse section'
          )

          const icon = document.createElement('span')
          icon.textContent = isCollapsed ? '▸' : '▾'
          btn.appendChild(icon)

          return btn
        },
        { key: `fold-arrow-${h.slug}`, side: -1 }
      )
    )
  })

  // 3. Apply hide decorations to all block nodes within collapsed ranges
  hiddenRanges.forEach(({ from, to }) => {
    doc.nodesBetween(from, to, (node, pos) => {
      if (pos < from || pos >= to) return
      if (node.isBlock) {
        decos.push(
          Decoration.node(pos, pos + node.nodeSize, {
            class: 'cw-hidden-by-fold',
          })
        )
      }
    })
  })

  return DecorationSet.create(doc, decos)
}
