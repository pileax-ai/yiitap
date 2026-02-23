import { EditorState, TextSelection, Transaction } from '@tiptap/pm/state'
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view'
import { gridResizingPluginKey } from './state'
import {
  findBoundaryPosition,
  getColumnInfoAtPos,
  updateColumnNodeFlex,
} from '../utils/utils'

function updateActiveHandle(view: EditorView, value: number) {
  view.dispatch(
    view.state.tr.setMeta(gridResizingPluginKey, {
      setHandle: value,
    })
  )
}

export function handleMouseMove(view, event, handleWidth) {
  const pluginState = gridResizingPluginKey.getState(view.state)

  // 正在拖拽时，严禁修改任何 Handle 状态
  if (!pluginState || pluginState.dragging) return false

  const boundaryPos = findBoundaryPosition(view, event, handleWidth)

  if (boundaryPos !== pluginState.activeHandle) {
    // 只有在没拖拽时才更新高亮手柄
    updateActiveHandle(view, boundaryPos)
  }
  return false
}

export function handleMouseLeave(view: EditorView) {
  const pluginState = gridResizingPluginKey.getState(view.state)
  if (!pluginState) return false
  if (pluginState.activeHandle > -1 && !pluginState.dragging) {
    updateActiveHandle(view, -1)
  }
  return false
}

/**
 * Handles the mousedown event to initialize the resizing process.
 * @param {EditorView} view - The ProseMirror editor view.
 * @param {MouseEvent} event - The native mouse event.
 * @param {number} minFlex - The minimum flex-grow value allowed for a column.
 */
export function handleMouseDown(
  view: EditorView,
  event: MouseEvent,
  minFlex: number = 0.1
): boolean {
  const pluginState = gridResizingPluginKey.getState(view.state)

  // 1. Validation of the current state
  if (!pluginState || pluginState.activeHandle === -1 || pluginState.dragging) {
    return false
  }

  const columnInfo = getColumnInfoAtPos(view, pluginState.activeHandle)
  if (!columnInfo) return false

  const { $pos, node, columnEl } = columnInfo
  const nodePos = $pos.before()
  const containerEl = columnEl.parentElement as HTMLElement

  if (!containerEl) return false

  // 2. Identify the next sibling column for paired resizing
  const nextColPos = nodePos + node.nodeSize
  const nextNode = view.state.doc.nodeAt(nextColPos)
  const hasNext = nextNode && nextNode.type.name === 'column'

  // 3. Calculate the total flex-grow sum of all siblings in the container
  let totalFlex = 0
  $pos.parent.forEach((child) => {
    totalFlex += child.attrs.flexGrow || 1
  })

  const containerWidth = containerEl.offsetWidth

  // 4. Update plugin state to start tracking
  view.dispatch(
    view.state.tr.setMeta(gridResizingPluginKey, {
      setDragging: {
        startX: event.clientX,
        startFlex: node.attrs.flexGrow || 1,
        nextColFlex: hasNext ? nextNode.attrs.flexGrow || 1 : null,
        nextColPos: hasNext ? nextColPos : null,
        totalFlex: totalFlex,
        containerWidth: containerWidth,
      },
    })
  )

  const win = view.dom.ownerDocument.defaultView || window

  /**
   * Internal move handler for mousemove events.
   * This function calculates the new flex-grow values and updates the document.
   * @param {MouseEvent} e - The native mousemove event.
   */
  const move = (e: MouseEvent): void => {
    // 1. Check if the mouse button is still pressed
    if (!e.buttons) {
      finish()
      return
    }

    // 2. Retrieve the current dragging state from the plugin state
    const currentState = gridResizingPluginKey.getState(view.state)
    const dragging = currentState?.dragging
    if (!dragging) return

    const {
      startX,
      startFlex,
      nextColFlex,
      nextColPos,
      totalFlex,
      containerWidth,
    } = dragging

    // 3. Calculate horizontal movement delta in pixels
    const deltaX = e.clientX - startX

    /**
     * 4. Convert pixel delta to flex-grow delta.
     * We multiply by totalFlex to normalize sensitivity.
     * (deltaX / containerWidth) represents the percentage of the container moved.
     */
    const deltaFlex = (deltaX / containerWidth) * totalFlex

    const tr = view.state.tr

    // 5. Calculate the new flex-grow for the left column (current column)
    // minFlex ensures the column doesn't disappear visually
    let newLeftFlex = Math.max(minFlex, startFlex + deltaFlex)

    /**
     * 6. Paired Resizing Logic:
     * If there's a neighboring column on the right, we redistribute weight
     * between them so the rest of the columns remain static.
     */
    if (nextColPos !== null && nextColFlex !== null) {
      // The sum of the two columns' flex-grow must remain constant
      const pairTotalFlex = startFlex + nextColFlex

      // Calculate right column flex while respecting minFlex
      let newRightFlex = Math.max(minFlex, pairTotalFlex - newLeftFlex)

      // Reverse-adjust the left column in case the right column hit its minFlex limit
      newLeftFlex = pairTotalFlex - newRightFlex

      // Update the left column node attributes
      tr.setNodeMarkup(nodePos, undefined, {
        ...node.attrs,
        flexGrow: newLeftFlex,
      })

      // Update the right column node attributes
      const rightNode = view.state.doc.nodeAt(nextColPos)
      if (rightNode && rightNode.type.name === 'column') {
        tr.setNodeMarkup(nextColPos, undefined, {
          ...rightNode.attrs,
          flexGrow: newRightFlex,
        })
      }
    } else {
      /**
       * 7. Single Column Resizing:
       * Used if it's the last column in the container.
       */
      tr.setNodeMarkup(nodePos, undefined, {
        ...node.attrs,
        flexGrow: newLeftFlex,
      })
    }

    /**
     * 8. Performance optimization:
     * We use addToHistory(false) to prevent every pixel of movement
     * from being recorded as a separate undo/redo step.
     */
    view.dispatch(tr.setMeta('addToHistory', false))
  }

  /**
   * Cleans up listeners and resets dragging state.
   */
  const finish = (): void => {
    win.removeEventListener('mouseup', finish)
    win.removeEventListener('mousemove', move)
    view.dispatch(
      view.state.tr.setMeta(gridResizingPluginKey, { setDragging: null })
    )
  }

  win.addEventListener('mouseup', finish)
  win.addEventListener('mousemove', move)

  event.preventDefault()
  return true
}

export function handleGridDecorations(
  state: EditorState,
  boundaryPos: number
): DecorationSet {
  const $pos = state.doc.resolve(boundaryPos)

  if ($pos.nodeAfter === null) return DecorationSet.empty

  // Create a reusable widget
  const widget = Decoration.widget(
    boundaryPos,
    () => {
      // This function only runs when ProseMirror actually needs to create the DOM
      const widgetDom = document.createElement('div')
      widgetDom.className = 'grid-resize-handle'

      const circleButton = document.createElement('div')
      circleButton.className = 'circle-button'

      const plusIcon = document.createElement('div')
      plusIcon.className = 'plus'

      circleButton.appendChild(plusIcon)
      widgetDom.appendChild(circleButton)

      return widgetDom
    },
    {
      // Crucial: Use a key to help ProseMirror identify and reuse the decoration
      key: `grid-handle-${boundaryPos}`,
      // Ensure the handle stays at the same visual side
      side: 0,
    }
  )

  return DecorationSet.create(state.doc, [widget])
}

export function handleMouseUp(view: EditorView, event: MouseEvent): boolean {
  const div = event.target as HTMLElement
  if (!div) return false
  if (div.className !== 'circle-button' && div.className !== 'plus')
    return false

  const column = div.closest('[data-type="column"]')
  if (!column) return false

  const boundryPos = view.posAtDOM(column, 0)
  if (!boundryPos) return false

  const { state } = view
  const $pos = state.doc.resolve(boundryPos)
  const { column: columnType, paragraph: paragraphType } = state.schema.nodes

  // 1. Calculate the insertion point (at the end of the columns container)
  const insertPos = $pos.after($pos.depth)

  // 2. Create the new column with an empty paragraph
  const newColumn = columnType.create({ flexGrow: 1 }, paragraphType.create())

  const tr = state.tr.insert(insertPos, newColumn)

  /**
   * 3. Focus logic:
   * The new column is inserted at 'insertPos'.
   * The structure is: <column><paragraph> content </paragraph></column>
   * - insertPos: start of <column>
   * - insertPos + 1: start of <paragraph>
   * - insertPos + 2: inside the <paragraph> (where the text goes)
   */
  const resolveNewPos = tr.doc.resolve(insertPos + 2)
  const selection = TextSelection.near(resolveNewPos)

  view.dispatch(tr.setSelection(selection).scrollIntoView())

  // 4. Ensure the editor DOM gets focus
  view.focus()

  return true
}
