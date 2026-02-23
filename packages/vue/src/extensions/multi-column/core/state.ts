import { PluginKey, Transaction } from '@tiptap/pm/state'

export const gridResizingPluginKey = new PluginKey<GridResizeState>(
  'gridResizingPlugin'
)
export type Dragging = {
  startX: number
  startFlex: number
  nextColFlex: number | null
  nextColPos: number | null
  totalFlex: number // 整个容器的总权重
  containerWidth: number // 容器的像素宽度
}

export class GridResizeState {
  activeHandle: number
  dragging: Dragging | null

  constructor(activeHandle: number, dragging: Dragging | null) {
    this.activeHandle = activeHandle
    this.dragging = dragging
  }

  apply(tr: any) {
    const action = tr.getMeta(gridResizingPluginKey)
    if (action?.setHandle !== undefined) {
      return new GridResizeState(action.setHandle, this.dragging)
    }
    if (action?.setDragging !== undefined) {
      return new GridResizeState(this.activeHandle, action.setDragging)
    }
    return this
  }
}
