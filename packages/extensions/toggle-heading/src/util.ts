import { Decoration, DecorationSet } from '@tiptap/pm/view'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

const makeSlugger = () => {
  const seen = new Map<string, number>()
  return (text: string) => {
    const base = text
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
  const out: { slug: string; level: number; pos: number; node: ProseMirrorNode }[] = []
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

export const buildDecorations = (doc: ProseMirrorNode, folded: Set<string>): DecorationSet  => {
  const decos: Decoration[] = []
  const headings = outlineOf(doc)

  // 1. 找出每个折叠标题的“作用范围” [contentStart, contentEnd)
  const hiddenRanges: { from: number; to: number }[] = []
  headings.forEach((h, i) => {
    if (!folded.has(h.slug)) return
    const contentStart = h.pos + h.node.nodeSize
    const next = headings.slice(i + 1).find((n) => n.level <= h.level)
    const contentEnd = next ? next.pos : doc.content.size
    hiddenRanges.push({ from: contentStart, to: contentEnd })
  })

  // 2. 为所有 heading 注入箭头 widget 和折叠 class
  headings.forEach((h) => {
    const isFolded = folded.has(h.slug)
    const nodeEnd = h.pos + h.node.nodeSize

    // 给 heading 节点加上 cw-heading / cw-folded class，用于 CSS 定位箭头
    decos.push(
      Decoration.node(h.pos, nodeEnd, {
        class: `cw-heading${isFolded ? ' cw-folded' : ''}`,
        'data-anchor': h.slug,
      })
    )

    // 在 heading 开始处注入可点击的箭头（widget 不进入文档内容）
    decos.push(
      Decoration.widget(h.pos + 1, () => {
        const btn = document.createElement('button')
        btn.className = 'cw-fold-btn'
        btn.type = 'button'
        btn.dataset.slug = h.slug          // 直接挂 slug，click 处理更稳
        btn.setAttribute('aria-label', isFolded ? 'Expand section' : 'Collapse section')
        btn.textContent = isFolded ? '▸' : '▾'
        return btn
      }, { key: `fold-arrow-${h.slug}`, side: -1 })
    )
  })

  // 3. 对折叠范围内的所有内容应用隐藏装饰
  // 使用 Decoration.node 给范围内的顶层节点添加隐藏 class
  hiddenRanges.forEach(({ from, to }) => {
    doc.nodesBetween(from, to, (node, pos) => {
      if (pos < from || pos >= to) return
      // 只对块级节点加隐藏 class，避免影响行内结构
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
