import { Extension } from '@tiptap/core'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { EditorProps, EditorView } from '@tiptap/pm/view'

export interface ColumnDropCursorOptions {
  HTMLAttributes: Record<string, any>
}

export const ColumnDropCursor = Extension.create<ColumnDropCursorOptions>({
  name: 'columnDropCursor',

  addProseMirrorPlugins() {
    let cursorEl: HTMLElement | null = null

    const hideCursor = (view: any) => {
      if (cursorEl) cursorEl.style.display = 'none'
      view.dom.classList.remove('hide-native-dropcursor')
    }

    return [
      new Plugin({
        key: new PluginKey('columnDropCursor'),
        view(view) {
          cursorEl = document.createElement('div')
          cursorEl.className = 'column-dropcursor'
          Object.assign(cursorEl.style, {
            position: 'absolute',
            display: 'none',
            pointerEvents: 'none',
            backgroundColor: 'skyblue',
            zIndex: '1000',
            width: '4px',
            transition: 'top 0.1s ease, left 0.05s ease, height 0.1s ease',
          })
          view.dom.parentElement?.appendChild(cursorEl)

          const onDragEnd = () => hideCursor(view)
          window.addEventListener('dragend', onDragEnd)

          return {
            destroy() {
              window.removeEventListener('dragend', onDragEnd)
              cursorEl?.remove()
              cursorEl = null
            },
          }
        },
        props: {
          handleDOMEvents: {
            dragover: (view, event) => {
              const editorRect = view.dom.getBoundingClientRect()

              // 1. Precise Detection: Check if hovering over a specific column
              const target = document.elementFromPoint(
                event.clientX,
                event.clientY
              )
              const columnDOM = target?.closest(
                '[data-type="column"]'
              ) as HTMLElement

              if (columnDOM) {
                const rect = columnDOM.getBoundingClientRect()
                // Trigger if mouse is in the right 40% of this specific column
                const isRightSide =
                  event.clientX > rect.right - rect.width * 0.4

                if (isRightSide) {
                  event.preventDefault()
                  event.dataTransfer!.dropEffect = 'move'

                  if (cursorEl) {
                    cursorEl.style.display = 'block'
                    cursorEl.style.height = `${rect.height}px`
                    cursorEl.style.top = `${view.dom.offsetTop + (rect.top - editorRect.top)}px`
                    cursorEl.style.left = `${view.dom.offsetLeft + (rect.left - editorRect.left) + rect.width + 4}px`
                  }
                  view.dom.classList.add('hide-native-dropcursor')
                  return true
                }
              }

              // 2. Fallback: Top-level node detection (for standard blocks)
              const middleX = editorRect.left + editorRect.width / 2
              const topLevelTarget = document.elementFromPoint(
                middleX,
                event.clientY
              )
              const nodeDOM = topLevelTarget?.closest(
                '.tiptap > *'
              ) as HTMLElement

              if (
                nodeDOM &&
                !nodeDOM.matches('[data-type="column-container"]')
              ) {
                const rect = nodeDOM.getBoundingClientRect()
                const isRightSide =
                  event.clientX > rect.right - 40 && event.clientX < rect.right

                if (isRightSide) {
                  event.preventDefault()
                  event.dataTransfer!.dropEffect = 'move'
                  if (cursorEl) {
                    cursorEl.style.display = 'block'
                    cursorEl.style.height = `${rect.height}px`
                    cursorEl.style.top = `${view.dom.offsetTop + (rect.top - editorRect.top)}px`
                    cursorEl.style.left = `${view.dom.offsetLeft + (rect.left - editorRect.left) + rect.width + 4}px`
                  }
                  view.dom.classList.add('hide-native-dropcursor')
                  return true
                }
              }

              hideCursor(view)
              return false
            },

            drop: (view, event) => {
              const editorRect = view.dom.getBoundingClientRect()

              // Find the column or top-level node at drop point
              const dropTarget = document.elementFromPoint(
                event.clientX,
                event.clientY
              )
              const columnDOM = dropTarget?.closest(
                '[data-type="column"]'
              ) as HTMLElement

              // If not on the right side of something, let default behavior handle it
              const detectDOM =
                columnDOM || (dropTarget?.closest('.tiptap > *') as HTMLElement)
              if (!detectDOM) return false

              const rect = detectDOM.getBoundingClientRect()
              const isRightSide = event.clientX > rect.left + rect.width * 0.5
              if (!isRightSide) return false

              event.preventDefault()
              event.stopPropagation()
              hideCursor(view)

              const dragging = (view as any).dragging
              const slice = dragging?.slice
              if (!slice) return false

              const { state, dispatch } = view
              const { column, columns } = state.schema.nodes

              let tr = state.tr
              if (dragging.move) {
                const { from, to } = state.selection
                tr.delete(from, to)
              }

              // Resolve insertion position
              const isSourceColumns =
                slice.content.firstChild?.type.name === 'columns'
              const pos = view.posAtDOM(detectDOM, 0)
              const $pos = state.doc.resolve(pos)

              try {
                if (columnDOM) {
                  /**
                   * Scenario: Dropping into a specific column of an existing multi-column
                   * We insert the new column(s) immediately AFTER this column
                   */
                  const insertPos = tr.mapping.map($pos.after($pos.depth))
                  const nodesToInsert: any[] = []

                  if (isSourceColumns) {
                    slice.content.firstChild!.content.forEach(
                      (child: ProseMirrorNode) => nodesToInsert.push(child)
                    )
                  } else {
                    nodesToInsert.push(
                      column.create({ flexGrow: 1 }, slice.content)
                    )
                  }

                  tr.insert(insertPos, nodesToInsert)
                } else {
                  /**
                   * Scenario: Dropping to the right of a top-level block
                   * Standard merge/create logic
                   */
                  const actualTargetPos = tr.mapping.map($pos.before(1))
                  const targetNode = tr.doc.nodeAt(actualTargetPos)
                  if (!targetNode) return false

                  if (isSourceColumns) {
                    const sourceColumnsNode = slice.content.firstChild!
                    const columnsList = [
                      column.create({ flexGrow: 1 }, targetNode),
                    ]
                    sourceColumnsNode.content.forEach(
                      (child: ProseMirrorNode) => columnsList.push(child)
                    )
                    tr.replaceWith(
                      actualTargetPos,
                      actualTargetPos + targetNode.nodeSize,
                      columns.create(null, columnsList)
                    )
                  } else {
                    const container = columns.create(null, [
                      column.create({ flexGrow: 1 }, targetNode),
                      column.create({ flexGrow: 1 }, slice.content),
                    ])
                    tr.replaceWith(
                      actualTargetPos,
                      actualTargetPos + targetNode.nodeSize,
                      container
                    )
                  }
                }

                ;(view as any).dragging = null
                if (dispatch) dispatch(tr)
                return true
              } catch (e) {
                console.error('Column drop error:', e)
                return false
              }
            },
          },
          handleDragLeave: (view: EditorView) => hideCursor(view),
        } as EditorProps,
      }),
    ]
  },
})
