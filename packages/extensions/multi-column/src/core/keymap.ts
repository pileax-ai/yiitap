import { liftTarget, canSplit } from '@tiptap/pm/transform'
import { TextSelection, type Command } from '@tiptap/pm/state'
import {
  splitBlock,
  chainCommands,
  newlineInCode,
  createParagraphNear,
} from '@tiptap/pm/commands'
import { keymap } from '@tiptap/pm/keymap'
import { ResolvedPos } from '@tiptap/pm/model'

function findParentColumn($pos: ResolvedPos) {
  for (let depth = $pos.depth; depth > 0; depth--) {
    const node = $pos.node(depth)
    if (node.type.name === 'column') {
      return { node, depth }
    }
  }
  return null
}

/**
 * Check if a slash command popup or suggestion menu is visible in the DOM.
 * @returns {boolean}
 */
const isSuggestionOpen = (): boolean => {
  const popup = document.querySelector('.slash-tippy')
  return !!popup
}

export const liftEmptyBlock: Command = (state, dispatch) => {
  const { $cursor } = state.selection as TextSelection
  if (!$cursor || $cursor.parent.content.size) return false
  if ('column' === $cursor.node($cursor.depth - 1).type.name) return false
  if ($cursor.depth > 1 && $cursor.after() != $cursor.end(-1)) {
    const before = $cursor.before()
    if (canSplit(state.doc, before)) {
      if (dispatch) dispatch(state.tr.split(before).scrollIntoView())
      return true
    }
  }
  const range = $cursor.blockRange(),
    target = range && liftTarget(range)
  if (target == null) return false
  if (dispatch) dispatch(state.tr.lift(range!, target).scrollIntoView())
  return true
}

export const columnsKeymap = keymap({
  Enter: (state, dispatch, view) => {
    // 1. If a suggestion menu is open, return false to let the suggestion plugin handle 'Enter'
    if (isSuggestionOpen()) {
      return false
    }

    // 2. Otherwise, fall back to the standard column enter behavior
    return chainCommands(
      newlineInCode,
      createParagraphNear,
      liftEmptyBlock,
      splitBlock
    )(state, dispatch, view)
  },
  'Mod-a': (state, dispatch, view) => {
    const { selection } = state
    const { $from } = selection
    const found = findParentColumn($from)
    if (found) {
      const { depth } = found
      const start = $from.start(depth)
      const end = $from.end(depth)
      const tr = state.tr.setSelection(
        TextSelection.create(state.doc, start, end)
      )
      if (dispatch) dispatch(tr)
      return true
    }
    return false
  },
} as { [key: string]: Command })
