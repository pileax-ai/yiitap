import { EditorView } from '@tiptap/pm/view'
import { type Dragging } from '../core/state'

export function findBoundaryPosition(
  view: EditorView,
  event: MouseEvent,
  handleWidth: number
): number {
  const gridDOM = event
    .composedPath()
    .find(
      (el) =>
        el instanceof Element && el.matches('[data-type="column-container"]')
    ) as HTMLElement | undefined
  if (!gridDOM) return -1

  const children = Array.from(gridDOM.children).filter((el) =>
    (el as HTMLElement)?.matches('[data-type="column"]')
  )
  for (let i = 0; i < children.length; i++) {
    const colEl = children[i] as HTMLElement
    const rect = colEl.getBoundingClientRect()
    if (
      event.clientX >= rect.right - handleWidth - 2 &&
      event.clientX <= rect.right + 10 + handleWidth
    ) {
      const pos = view.posAtDOM(colEl, 0)
      if (pos != null) {
        return pos
      }
    }
  }

  return -1
}

/**
 * 更新节点的 flexGrow 属性
 */
export function updateColumnNodeFlex(
  view: EditorView,
  pos: number,
  flex: number
) {
  const { state, dispatch } = view
  const node = state.doc.nodeAt(pos)
  if (!node || node.type.name !== 'column') return

  const roundedFlex = Math.round(flex * 100) / 100 // 保留两位小数

  // 使用 setNodeMarkup 修改属性，这会触发 renderHTML 重新生成 style
  dispatch(
    state.tr
      .setNodeMarkup(pos, undefined, {
        ...node.attrs,
        flexGrow: roundedFlex,
      })
      .setMeta('addToHistory', false) // 拖拽过程不记录每一帧到历史记录
  )
}

/**
 * 获取当前位置的列信息
 */
export function getColumnInfoAtPos(view: EditorView, boundaryPos: number) {
  const $pos = view.state.doc.resolve(boundaryPos)
  const node = $pos.parent
  if (!node || node.type.name !== 'column') return null

  const dom = view.domAtPos($pos.pos)
  if (!dom.node) return null

  const columnEl =
    dom.node instanceof HTMLElement
      ? dom.node
      : (dom.node.childNodes[dom.offset] as HTMLElement)

  const domWidth = columnEl.offsetWidth

  return { $pos, node, columnEl, domWidth }
}
