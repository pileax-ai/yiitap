// toggleBlock.ts
import { Node, mergeAttributes, InputRule, type NodeViewRendererProps } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

export interface ToggleBlockOptions {
  HTMLAttributes: Record<string, any>
  triggerCharacters: string[]
  placeholder: string | (() => string)
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    toggleBlock: {
      insertToggleBlock: (attributes?: { level?: number }) => ReturnType
      setToggleBlock: (attributes?: { level?: number }) => ReturnType
      unsetToggleBlock: () => ReturnType
      toggleToggleBlock: (attributes?: { level?: number }) => ReturnType
    }
  }
}

export const ToggleBlock = Node.create<ToggleBlockOptions>({
  name: 'toggleBlock',
  group: 'block',
  content: 'toggleHead toggleBody',
  defining: true,
  isolating: true,
  priority: 1000,

  addOptions() {
    return {
      HTMLAttributes: {},
      triggerCharacters: ['>'],
      placeholder: ''
    }
  },

  addAttributes() {
    return {
      open: {
        default: true,
        parseHTML: (element) => element.getAttribute('data-open') === 'true',
        renderHTML: (attributes) => ({
          'data-open': attributes.open ? 'true' : 'false',
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="toggle-block"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'toggle-block',
        class: 'toggle-block',
      }),
      0,
    ]
  },

  renderMarkdown: (node, helpers) => {
    const headNode = node.content?.[0]
    const bodyNode = node.content?.[1]

    const level = (headNode?.attrs as Record<string, any>)?.level ?? 0
    const headText = helpers.renderChildren(headNode?.content ?? []).trim()

    let bodyText = ''
    if (bodyNode && bodyNode.content) {
      const renderedChildren = bodyNode.content.map(child => helpers.renderChildren([child]))
      bodyText = renderedChildren.join('\n\n').trim()
    }

    const headingLine = level === 0 ? headText : `${'#'.repeat(level)} ${headText}`

    if (!bodyText) {
      return `${headingLine}\n\n`
    }

    return `${headingLine}\n\n${bodyText}\n\n`
  },

  addNodeView() {
    return ({ node, getPos, editor }: NodeViewRendererProps) => {
      const container = document.createElement('div')
      container.classList.add('toggle-block-wrapper')
      container.setAttribute('data-open', node.attrs.open ? 'true' : 'false')

      const level = node.child(0)?.attrs?.level || 0

      const button = document.createElement('button')
      button.classList.add('toggle-block-btn', `toggle-block-btn-h${level}`)
      button.setAttribute('contenteditable', 'false')
      button.innerHTML = `<svg class="toggle-icon" viewBox="0 0 16 16" width="20" height="20"><path d="M2.835 3.25a.8.8 0 0 0-.69 1.203l5.164 8.854a.8.8 0 0 0 1.382 0l5.165-8.854a.8.8 0 0 0-.691-1.203z"/></svg>`

      button.addEventListener('click', (e) => {
        e.preventDefault()
        if (typeof getPos === 'function') {
          const pos = getPos()
          if (typeof pos === 'number') {
            editor.commands.command(({ tr, state }) => {
              const currentNode = state.doc.nodeAt(pos)
              if (!currentNode) return false

              tr.setNodeMarkup(pos, undefined, {
                ...currentNode.attrs,
                open: !currentNode.attrs.open,
              })
              return true
            })
          }
        }
      })

      const contentDOM = document.createElement('div')
      contentDOM.classList.add('toggle-block-content')

      container.appendChild(button)
      container.appendChild(contentDOM)

      return {
        dom: container,
        contentDOM,
        update: (updatedNode) => {
          if (updatedNode.type.name !== this.name) return false
          container.setAttribute('data-open', updatedNode.attrs.open ? 'true' : 'false')

          const newLevel = updatedNode.child(0)?.attrs?.level || 0
          button.className = `toggle-block-btn toggle-block-btn-h${newLevel}`

          return true
        },
      }
    }
  },

  addCommands() {
    return {
      insertToggleBlock:
        (attrs) =>
          ({ state, dispatch, tr }) => {
            const level = attrs?.level || 0
            const { $from, $to } = state.selection
            const range = $from.blockRange($to)

            if (!range) {
              return false
            }

            const toggleBlockNode = state.schema.node(this.name, { open: true }, [
              state.schema.node('toggleHead', { level }, []),
              state.schema.node('toggleBody', {}, [
                state.schema.node('paragraph', {}, []),
              ]),
            ])

            const currentNode = $from.parent
            const isEmptyParagraph = currentNode.type.name === 'paragraph' && currentNode.content.size === 0

            let toggleBlockDepth = -1
            let isInsideToggleHead = false

            for (let d = $from.depth; d > 0; d--) {
              const node = $from.node(d)
              if (node.type.name === this.name) {
                toggleBlockDepth = d
                const childNode = $from.node(d + 1)
                if (childNode && childNode.type.name === 'toggleHead') {
                  isInsideToggleHead = true
                }
                break
              }
            }

            if (dispatch) {
              let targetStart = range.start

              if (toggleBlockDepth !== -1) {
                if (isInsideToggleHead) {
                  targetStart = $from.after(toggleBlockDepth)
                } else {
                  targetStart = range.end
                }
                tr.insert(targetStart, toggleBlockNode)
              } else if (isEmptyParagraph) {
                tr.replaceRangeWith(range.start, range.end, toggleBlockNode)
                targetStart = range.start
              } else {
                targetStart = range.end
                tr.insert(targetStart, toggleBlockNode)
              }

              const resolvedPos = tr.doc.resolve(targetStart + 2)
              tr.setSelection(TextSelection.near(resolvedPos))

              dispatch(tr)
              return true
            }

            return false
          },

      setToggleBlock: (attributes?: { level?: number }) => ({ state, dispatch, tr }) => {
        const { selection, schema } = state
        const { $from, $to } = selection
        const targetLevel = attributes?.level ?? 0

        // Returns true when a sibling should NOT be absorbed into a toggle at `level`.
        // Headings are always level >= 1, so a level-0 toggle absorbs all of them.
        // A toggleBlock's level lives on its toggleHead (first child).
        const shouldStop = (sibling: any, level: number): boolean => {
          if (sibling.type.name === 'heading') {
            const siblingLevel = sibling.attrs.level || 1
            return level > 0 && siblingLevel <= level
          }
          if (sibling.type.name === this.name) {
            const siblingLevel = sibling.firstChild?.attrs?.level ?? 0
            return siblingLevel <= level
          }
          return false
        }

        // Walk siblings from `startIndex` and collect those that belong to a toggle at `level`.
        const collectAbsorbed = (parentContainer: any, startIndex: number, level: number) => {
          const nodes: any[] = []
          let endOffset = 0
          for (let i = startIndex; i < parentContainer.childCount; i++) {
            const sibling = parentContainer.child(i)
            if (shouldStop(sibling, level)) break
            nodes.push(sibling)
            endOffset += sibling.nodeSize
          }
          return { nodes, endOffset }
        }

        // Rebuild a toggleBlock with the new level.
        // NOTE: a SMALLER level number means a HIGHER hierarchy, so it absorbs MORE siblings.
        // When the level number grows (hierarchy lowers), the body is left untouched to
        // avoid splitting existing content apart.
        const rebuildToggleBlock = (
          node: any,
          oldLevel: number,
          blockStart: number,
          blockEnd: number,
          parentContainer: any,
          nodeIndex: number,
        ): boolean => {
          if (oldLevel === targetLevel) return false

          const headNode = node.child(0)
          const bodyNode = node.child(1)

          let absorbed: any[] = []
          let extraEnd = 0
          if (targetLevel < oldLevel) {
            // Level number decreased → hierarchy raised → absorb extra siblings.
            const res = collectAbsorbed(parentContainer, nodeIndex + 1, targetLevel)
            absorbed = res.nodes
            extraEnd = res.endOffset
          }

          const newHeadNode = schema.node(
            'toggleHead',
            { ...headNode.attrs, level: targetLevel },
            headNode.content,
          )

          let newBodyNode = bodyNode
          if (absorbed.length > 0) {
            const newBodyContent: any[] = []
            bodyNode.forEach((child: any) => newBodyContent.push(child))
            // Drop the placeholder empty paragraph added when nothing was absorbed before.
            if (
              newBodyContent.length === 1 &&
              newBodyContent[0].type.name === 'paragraph' &&
              newBodyContent[0].content.size === 0
            ) {
              newBodyContent.length = 0
            }
            newBodyContent.push(...absorbed)
            newBodyNode = schema.node('toggleBody', {}, newBodyContent)
          }

          const newBlockNode = schema.node(this.name, { ...node.attrs, open: true }, [
            newHeadNode,
            newBodyNode,
          ])

          tr.replaceWith(blockStart, blockEnd + extraEnd, newBlockNode)
          return true
        }

        // 1. Locate the nearest enclosing toggleBlock.
        let toggleBlockDepth = -1
        let toggleBlockNode: any = null
        let isInsideToggleHead = false

        for (let d = $from.depth; d > 0; d--) {
          const node = $from.node(d)
          if (node.type.name === this.name) {
            toggleBlockDepth = d
            toggleBlockNode = node
            const childNode = $from.node(d + 1)
            if (childNode && childNode.type.name === 'toggleHead') {
              isInsideToggleHead = true
            }
            break
          }
        }

        // Case A: cursor is inside a toggleHead → adjust level and absorb extra siblings.
        if (toggleBlockDepth !== -1 && toggleBlockNode && isInsideToggleHead) {
          if (!dispatch) return true
          const currentLevel = toggleBlockNode.child(0).attrs.level || 0
          rebuildToggleBlock(
            toggleBlockNode,
            currentLevel,
            $from.before(toggleBlockDepth),
            $from.after(toggleBlockDepth),
            $from.node(toggleBlockDepth - 1),
            $from.index(toggleBlockDepth - 1),
          )
          dispatch(tr)
          return true
        }

        const range = $from.blockRange($to)
        if (!range) return false

        const currentNode = $from.parent
        const nodeTypeName = currentNode.type.name

        // Case B: the selected node itself is a toggleBlock → adjust level and absorb extra siblings.
        if (nodeTypeName === this.name) {
          if (!dispatch) return true
          const currentLevel = currentNode.child(0).attrs.level || 0
          rebuildToggleBlock(
            currentNode,
            currentLevel,
            range.start,
            range.end,
            $from.node($from.depth - 1),
            $from.index($from.depth - 1),
          )
          dispatch(tr)
          return true
        }

        if (nodeTypeName !== 'heading' && nodeTypeName !== 'paragraph') return false

        // Case C: convert a heading / paragraph into a toggleBlock.
        const effectiveLevel =
          attributes?.level ?? (nodeTypeName === 'heading' ? currentNode.attrs.level || 1 : 0)
        const nodePos = range.start
        const nodeEnd = range.end

        const depth = $from.depth
        const parentContainer = $from.node(depth - 1)
        const nodeIndex = $from.index(depth - 1)

        const { nodes: childNodes, endOffset } = collectAbsorbed(
          parentContainer,
          nodeIndex + 1,
          effectiveLevel,
        )
        const lastNodeEnd = nodeEnd + endOffset

        // Ensure toggleBody is never empty (schema requires block+).
        if (childNodes.length === 0) {
          childNodes.push(schema.node('paragraph', {}, []))
        }

        if (dispatch) {
          const content = currentNode.content
          const headNode = schema.node('toggleHead', { level: effectiveLevel }, content)
          const toggleBodyNode = schema.node('toggleBody', {}, childNodes)
          const toggleBlockNode = schema.node(this.name, { open: true }, [
            headNode,
            toggleBodyNode,
          ])

          tr.replaceWith(nodePos, lastNodeEnd, toggleBlockNode)

          const targetPos = nodePos + 2 + content.size
          tr.setSelection(TextSelection.near(tr.doc.resolve(targetPos)))
          dispatch(tr)
        }
        return true
      },

      unsetToggleBlock: () => ({ state, dispatch, tr }) => {
        const { selection } = state
        const { $from } = selection

        const currentNode = $from.parent
        const nodeTypeName = currentNode.type.name

        if (!['toggleHead', 'toggleBlock'].includes(nodeTypeName)) {
          return false
        }

        let toggleBlockDepth = -1
        let toggleBlockNode: any = null

        for (let d = $from.depth; d > 0; d--) {
          const node = $from.node(d)
          if (node.type.name === this.name) {
            toggleBlockDepth = d
            toggleBlockNode = node
            break
          }
        }

        if (toggleBlockDepth === -1 || !toggleBlockNode) return false

        const toggleBlockPos = $from.before(toggleBlockDepth)
        const toggleBlockEnd = toggleBlockPos + toggleBlockNode.nodeSize

        const headNode = toggleBlockNode.child(0)
        const bodyNode = toggleBlockNode.child(1)

        const level = headNode.attrs.level || 0
        const headContent = headNode.content

        const bodyNodes: any[] = []
        bodyNode.forEach((node: any) => {
          bodyNodes.push(node)
        })

        if (dispatch) {
          const restoredMainNode = level > 0
            ? state.schema.node('heading', { level }, headContent)
            : state.schema.node('paragraph', {}, headContent)

          const nodesToInsert = [restoredMainNode, ...bodyNodes]

          tr.replaceWith(toggleBlockPos, toggleBlockEnd, nodesToInsert)

          const resolvedPos = tr.doc.resolve(toggleBlockPos + 1)
          tr.setSelection(TextSelection.near(resolvedPos))

          dispatch(tr)
        }

        return true
      },

      toggleToggleBlock: (attributes?: { level?: number }) => ({ state, commands, dispatch, tr }) => {
        const { selection } = state
        const { $from } = selection

        let toggleBlockDepth = -1
        let toggleBlockNode: any = null
        let isInsideToggleHead = false

        for (let d = $from.depth; d > 0; d--) {
          const node = $from.node(d)
          if (node.type.name === this.name) {
            toggleBlockDepth = d
            toggleBlockNode = node

            const childNode = $from.node(d + 1)
            if (childNode && childNode.type.name === 'toggleHead') {
              isInsideToggleHead = true
            }
            break
          }
        }

        const targetLevel = attributes?.level ?? 0

        if (toggleBlockDepth !== -1 && toggleBlockNode && isInsideToggleHead) {
          const headNode = toggleBlockNode.child(0)
          const currentLevel = headNode.attrs.level || 0

          if (currentLevel === targetLevel) {
            return commands.unsetToggleBlock()
          }

          const headPos = $from.before(toggleBlockDepth) + 1
          if (dispatch) {
            tr.setNodeMarkup(headPos, undefined, { ...headNode.attrs, level: targetLevel })
            dispatch(tr)
          }
          return true
        }

        return commands.setToggleBlock(attributes)
      }
    }
  },

  addInputRules() {
    const { triggerCharacters } = this.options
    const escaped = triggerCharacters
      .map((ch) => ch.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .join('')
    const regexp = new RegExp(`^[${escaped}]\\s$`)

    return [
      new InputRule({
        find: regexp,
        handler: ({ state, range }) => {
          const { tr, schema } = state
          const $from = state.doc.resolve(range.from)
          const parentNode = $from.parent

          let level = 0
          let blockStart = range.from
          let blockEnd = range.to
          const headingContent: any[] = []
          const bodyNodes: any[] = []

          if (parentNode.type.name === 'heading') {
            // ───────── Heading branch (">" stripped as fixed previously) ─────────
            const headingLevel = parentNode.attrs.level || 1
            if (headingLevel >= 1 && headingLevel <= 5) {
              level = headingLevel
            }

            const depth = $from.depth
            blockStart = $from.before(depth)
            blockEnd = $from.after(depth)

            // Collect heading inline content while excluding the trigger characters ("> ")
            let pos = $from.start(depth)
            parentNode.forEach((node) => {
              const nodeStart = pos
              const nodeEnd = pos + node.nodeSize
              pos = nodeEnd

              if (nodeEnd <= range.from || nodeStart >= range.to) {
                // Entirely outside the trigger range: keep as-is
                headingContent.push(node)
              } else if (nodeStart >= range.from && nodeEnd <= range.to) {
                // Entirely inside the trigger range (pure "> " text): drop it
              } else if (node.isText) {
                // Partially overlapping text node: keep only the non-overlapping slices
                const text = node.text || ''
                const localFrom = Math.max(0, range.from - nodeStart)
                const localTo = Math.min(text.length, range.to - nodeStart)
                const before = text.slice(0, localFrom)
                const after = text.slice(localTo)
                if (before) headingContent.push(schema.text(before, node.marks))
                if (after) headingContent.push(schema.text(after, node.marks))
              } else {
                headingContent.push(node)
              }
            })

            // Collect subsequent sibling nodes that belong to this toggle block's body
            const parentContainer = $from.node(depth - 1)
            const nodeIndex = $from.index(depth - 1)

            let lastNodeEnd = blockEnd
            for (let i = nodeIndex + 1; i < parentContainer.childCount; i++) {
              const sibling = parentContainer.child(i)

              // Stop at a heading of equal or higher level (headings are always level >= 1,
              // so a level-0 toggle block absorbs all of them).
              if (sibling.type.name === 'heading') {
                const siblingLevel = sibling.attrs.level || 1
                if (level > 0 && siblingLevel <= level) break
              } else if (sibling.type.name === this.name) {
                // toggleBlock: its level lives on the first child (toggleHead) attrs.
                // Stop at an equal-or-higher-level toggle block.
                const siblingLevel = sibling.firstChild?.attrs?.level ?? 0
                if (siblingLevel <= level) break
              }

              bodyNodes.push(sibling)
              lastNodeEnd += sibling.nodeSize
            }

            blockEnd = lastNodeEnd
          } else if (parentNode.type.name === 'paragraph') {
            // ───────── Paragraph branch: line-start ">" becomes a level-0 toggleBlock ─────────
            const depth = $from.depth
            // Replace the entire paragraph node, not just the "> " range,
            // otherwise inserting a block node inside the paragraph would violate the schema.
            blockStart = $from.before(depth)
            blockEnd = $from.after(depth)
            level = 0

            // Collect paragraph inline content while excluding the trigger characters ("> ")
            let pos = $from.start(depth)
            parentNode.forEach((node) => {
              const nodeStart = pos
              const nodeEnd = pos + node.nodeSize
              pos = nodeEnd

              if (nodeEnd <= range.from || nodeStart >= range.to) {
                // Entirely outside the trigger range: keep as-is
                headingContent.push(node)
              } else if (nodeStart >= range.from && nodeEnd <= range.to) {
                // Entirely inside the trigger range (e.g. the whole paragraph is "> "): drop it
              } else if (node.isText) {
                // Partially overlapping text node: keep only the non-overlapping slices
                const text = node.text || ''
                const localFrom = Math.max(0, range.from - nodeStart)
                const localTo = Math.min(text.length, range.to - nodeStart)
                const before = text.slice(0, localFrom)
                const after = text.slice(localTo)
                if (before) headingContent.push(schema.text(before, node.marks))
                if (after) headingContent.push(schema.text(after, node.marks))
              } else {
                headingContent.push(node)
              }
            })
            // Paragraph is a leaf block; no sibling absorption needed.
            // An empty body will be filled below to satisfy the schema.
          } else {
            // Fallback for other block types (e.g. blockquote): keep original behavior
            blockStart = range.from
            blockEnd = range.to
          }

          // Ensure toggleBody is never empty (schema requires block+)
          if (bodyNodes.length === 0) {
            bodyNodes.push(schema.node('paragraph', {}, []))
          }

          const toggleHeadNode = schema.node('toggleHead', { level }, headingContent)
          const toggleBodyNode = schema.node('toggleBody', {}, bodyNodes)
          const toggleBlockNode = schema.node(this.name, { open: true }, [
            toggleHeadNode,
            toggleBodyNode,
          ])

          tr.replaceWith(blockStart, blockEnd, toggleBlockNode)

          // Place the cursor at the start of toggleHead;
          // any pre-existing paragraph content will follow the cursor.
          const mappedPos = tr.mapping.map(blockStart)
          const targetPos = mappedPos + 1
          const resolvedPos = tr.doc.resolve(targetPos)
          tr.setSelection(TextSelection.near(resolvedPos))
        },
      }),
      new InputRule({
        find: /^\^\s(#{1,3})\s$/,
        handler: ({ state, range, match }) => {
          const level = match[1].length
          const { tr, schema } = state

          const toggleBlockNode = schema.node(this.name, { open: true }, [
            schema.node('toggleHead', { level }, []),
            schema.node('toggleBody', {}, [
              schema.node('paragraph', {}, []),
            ]),
          ])

          tr.replaceRangeWith(range.from, range.to, toggleBlockNode)

          const targetPos = range.from + 1
          const resolvedPos = tr.doc.resolve(targetPos)
          tr.setSelection(TextSelection.near(resolvedPos))
        },
      }),
    ]
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const { state } = this.editor
        const { selection } = state
        const { $from, empty } = selection

        if (!empty) return false

        // ==========================================
        // Case A: Inside toggleHead -> Dissolve toggleBlock when backspacing at start
        // ==========================================
        if ($from.parent.type.name === 'toggleHead' && $from.parentOffset === 0) {
          const toggleBlockDepth = $from.depth - 1
          const toggleBlockNode = $from.node(toggleBlockDepth)

          if (!toggleBlockNode || toggleBlockNode.type.name !== this.name) return false

          const headNode = $from.parent
          const level = headNode.attrs.level || 0
          const headContent = headNode.content
          const toggleBodyNode = toggleBlockNode.child(1)
          const bodyNodes: any[] = []

          if (toggleBodyNode && toggleBodyNode.content) {
            toggleBodyNode.forEach((node) => {
              bodyNodes.push(node)
            })
          }

          if (bodyNodes.length === 0) {
            bodyNodes.push(state.schema.node('paragraph', {}, []))
          }

          return this.editor.commands.command(({ tr, state, dispatch }) => {
            const pos = $from.before(toggleBlockDepth)
            const end = pos + toggleBlockNode.nodeSize

            const restoredNode = level > 0
              ? state.schema.node('heading', { level }, headContent)
              : state.schema.node('paragraph', {}, headContent)

            const nodesToInsert = [restoredNode, ...bodyNodes]

            tr.replaceWith(pos, end, nodesToInsert)

            // Keep cursor at the start of the restored node (line start)
            const mappedPos = tr.mapping.map(pos)
            const targetCursorPos = mappedPos + 1

            try {
              const resolvedPos = tr.doc.resolve(targetCursorPos)
              tr.setSelection(TextSelection.near(resolvedPos))
            } catch (e) {
              tr.setSelection(TextSelection.near(tr.doc.resolve(mappedPos + 1)))
            }

            if (dispatch) {
              dispatch(tr)
            }
            return true
          })
        }

        // ==========================================
        // Case B: At start of first block inside toggleBody -> Merge back into toggleHead
        // ==========================================
        if ($from.parent.type.name === 'paragraph' && $from.parentOffset === 0) {
          const bodyDepth = $from.depth - 1
          const bodyNode = $from.node(bodyDepth)

          if (bodyNode.type.name === 'toggleBody') {
            const toggleBlockDepth = $from.depth - 2
            const toggleBlockNode = $from.node(toggleBlockDepth)

            if (toggleBlockNode && toggleBlockNode.type.name === this.name) {
              if (toggleBlockNode.child(1) === bodyNode && bodyNode.firstChild === $from.parent) {
                const headNode = toggleBlockNode.child(0)
                const headContent = headNode.content
                const paragraphNode = $from.parent
                const paragraphContent = paragraphNode.content

                return this.editor.commands.command(({ tr, state, dispatch }) => {
                  const headingPos = $from.before(toggleBlockDepth)
                  const headStartPos = headingPos + 1
                  const headEndPos = headStartPos + headNode.nodeSize - 2
                  const originalHeadTextEnd = headEndPos

                  const mergedHeadContent = headContent.append(paragraphContent)
                  const level = headNode.attrs.level || 0
                  const newHeadNode = state.schema.node('toggleHead', { level }, mergedHeadContent)

                  const remainingBodyNodes: any[] = []
                  let firstSkipped = false
                  bodyNode.forEach((node) => {
                    if (firstSkipped) {
                      remainingBodyNodes.push(node)
                    } else {
                      firstSkipped = true
                    }
                  })

                  // Fallback if body becomes empty after merge
                  if (remainingBodyNodes.length === 0) {
                    remainingBodyNodes.push(state.schema.node('paragraph', {}, []))
                  }

                  const newToggleBodyNode = state.schema.node('toggleBody', {}, remainingBodyNodes)
                  const newToggleBlockNode = state.schema.node(
                    this.name,
                    { open: toggleBlockNode.attrs.open },
                    [newHeadNode, newToggleBodyNode]
                  )

                  const toggleBlockEnd = headingPos + toggleBlockNode.nodeSize
                  tr.replaceWith(headingPos, toggleBlockEnd, newToggleBlockNode)

                  const targetCursorPos = headingPos + headNode.nodeSize
                  tr.setSelection(TextSelection.near(tr.doc.resolve(targetCursorPos)))

                  if (dispatch) {
                    dispatch(tr)
                  }
                  return true
                })
              }
            }
          }
        }

        // ==========================================
        // Case C: At start of any block directly following a toggleBlock
        // -> Merge its content into the end of the preceding toggleBlock's body
        // ==========================================
        if ($from.parentOffset === 0) {
          const index = $from.index($from.depth - 1)
          const parent = $from.node($from.depth - 1)

          if (index > 0) {
            const prevSibling = parent.child(index - 1)

            if (prevSibling && prevSibling.type.name === this.name) {
              const currentBlock = $from.parent

              return this.editor.commands.command(({ tr, state, dispatch }) => {
                const prevBlockPos = $from.before($from.depth) - prevSibling.nodeSize
                const toggleBlockNode = prevSibling
                const headNode = toggleBlockNode.child(0)
                const bodyNode = toggleBlockNode.child(1)

                const bodyChildren: any[] = []
                bodyNode.forEach((node) => {
                  bodyChildren.push(node)
                })

                let cursorInsertPos = prevBlockPos + prevSibling.nodeSize - 1
                const lastIndex = bodyChildren.length - 1
                const lastChild = lastIndex >= 0 ? bodyChildren[lastIndex] : null

                if (lastChild && lastChild.type.name === 'paragraph' && currentBlock.type.name === 'paragraph') {
                  const originalLastChildTextEnd = prevBlockPos + toggleBlockNode.nodeSize - 2
                  const mergedParaContent = lastChild.content.append(currentBlock.content)
                  bodyChildren[lastIndex] = state.schema.node('paragraph', {}, mergedParaContent)
                  cursorInsertPos = prevBlockPos + toggleBlockNode.nodeSize - 3
                } else {
                  bodyChildren.push(currentBlock)
                }

                const newToggleBody = state.schema.node('toggleBody', {}, bodyChildren)
                const newToggleBlock = state.schema.node(
                  this.name,
                  { open: true },
                  [headNode, newToggleBody]
                )

                const deleteEnd = $from.after($from.depth)
                tr.replaceWith(prevBlockPos, deleteEnd, newToggleBlock)

                try {
                  const resolvedPos = tr.doc.resolve(cursorInsertPos)
                  tr.setSelection(TextSelection.near(resolvedPos))
                } catch (e) {
                  tr.setSelection(TextSelection.near(tr.doc.resolve(prevBlockPos + 2)))
                }

                if (dispatch) {
                  dispatch(tr)
                }
                return true
              })
            }
          }
        }

        return false
      },

      Enter: () => {
        if (document.querySelector('.slash-tippy') !== null) return false

        const { state } = this.editor
        const { $from, empty } = state.selection
        if (!empty) return false

        // Find the enclosing toggleBlock.
        let depth = -1
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.name === this.name) {
            depth = d
            break
          }
        }
        if (depth === -1) return false

        const block = $from.node(depth)
        const parentType = $from.parent.type.name
        const isOpen = block.attrs.open

        return this.editor.commands.command(({ tr, state, dispatch }) => {
          // (1) Empty paragraph inside toggleBody → exit the toggle block.
          if (parentType === 'paragraph' && $from.parent.content.size === 0) {
            const isOnlyChild = $from.node(depth + 1).childCount === 1
            const blockEnd = $from.after(depth)
            // Keep at least one paragraph in the body to satisfy `block+`.
            if (!isOnlyChild) tr.delete($from.before($from.depth), $from.after($from.depth))

            const pos = tr.mapping.map(blockEnd)
            tr.insert(pos, state.schema.node('paragraph', {}, []))
            tr.setSelection(TextSelection.near(tr.doc.resolve(pos + 1)))
          }
          // (2) Cursor inside toggleHead → move trailing content into the body.
          else if (parentType === 'toggleHead') {
            const cursor = $from.pos
            const headEnd = $from.end()
            const slice = state.doc.slice(cursor, headEnd)
            tr.delete(cursor, headEnd)

            const paragraph = state.schema.node('paragraph', {}, slice.content)
            const headingPos = tr.mapping.map($from.before(depth))
            const currentNode = tr.doc.nodeAt(headingPos) ?? block
            const headNode = currentNode.child(0)
            const insertPos = isOpen
              ? headingPos + 1 + headNode.nodeSize + 1
              : headingPos + currentNode.nodeSize

            tr.insert(insertPos, paragraph)
            tr.setSelection(TextSelection.near(tr.doc.resolve(insertPos + 1)))
          } else {
            return false
          }

          if (dispatch) dispatch(tr)
          return true
        })
      }
    }
  },
})
