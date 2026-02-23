import { Extension } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'
import { columnsKeymap } from '../core/keymap'
import { gridResizingPlugin } from '../plugins/resize'

export interface MultiColumnOptions {
  HTMLAttributes: Record<string, any>
}

/**
 * Define the structure for the insertMultiColumn command.
 * Default: Creates a container with 2 columns, each containing 1 paragraph.
 */
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    multiColumn: {
      /**
       * Insert a multi-column layout.
       * @param num - Number of columns (default: 2)
       */
      insertMultiColumn: (num?: number) => ReturnType
    }
  }
}

export const MultiColumn = Extension.create<MultiColumnOptions>({
  name: 'multiColumn',

  addProseMirrorPlugins() {
    return [
      gridResizingPlugin({
        handleWidth: 2,
        minColumnFlex: 0.5,
      }),
      columnsKeymap,
    ]
  },

  addCommands() {
    return {
      insertMultiColumn:
        (num = 2) =>
        ({ tr, dispatch, editor }) => {
          const { schema } = editor
          const { column, columns, paragraph } = schema.nodes
          if (!column || !columns || !paragraph) return false

          // 1. Create column nodes dynamically based on num
          const initColumns = []
          for (let i = 0; i < num; i++) {
            initColumns.push(
              column.create(
                { flexGrow: 1 },
                paragraph.create() // Ensure each column has a paragraph to start
              )
            )
          }

          // 2. Create the container node
          const container = columns.create(null, initColumns)

          // 3. Dispatch the transaction to insert at the current selection
          if (dispatch) {
            // 1. Get current selection start to track the insertion point
            const insertPos = tr.selection.from

            // 2. Perform the replacement
            tr.replaceSelectionWith(container)

            // 3. Focus inside the first column
            const resolvedPos = tr.doc.resolve(insertPos)
            const selection = TextSelection.near(resolvedPos)

            tr.setSelection(selection).scrollIntoView()
          }

          return true
        },
    }
  },
})
