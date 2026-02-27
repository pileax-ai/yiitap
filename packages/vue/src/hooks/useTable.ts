import { computed, ref } from 'vue'
import { TableMap } from '@tiptap/pm/tables'
import useI18n from './useI18n'
import useTiptap from './useTiptap'

export default function () {
  const { tr } = useI18n()
  const { isEditable, run } = useTiptap()

  const props = ref(null)
  const showColPopover = ref(false)
  const showRowPopover = ref(false)

  const columnActions = computed(() => {
    return [
      {
        label: tr('table.selectColumn'),
        value: 'selectColumn',
        icon: 'select_all',
      },
      {
        label: tr('table.insertLeft'),
        value: 'tableAddColumnBefore',
        icon: 'arrow_back',
      },
      {
        label: tr('table.insertRight'),
        value: 'tableAddColumnAfter',
        icon: 'arrow_back',
        class: 'rotate-180',
      },
      {
        label: tr('editor.delete'),
        value: 'tableDeleteColumn',
        icon: 'delete',
      },
    ]
  })

  const rowActions = computed(() => {
    return [
      { label: tr('table.selectRow'), value: 'selectRow', icon: 'select_all' },
      {
        label: tr('table.insertAbove'),
        value: 'tableAddRowBefore',
        icon: 'arrow_back',
        class: 'rotate-90',
      },
      {
        label: tr('table.insertBelow'),
        value: 'tableAddRowAfter',
        icon: 'arrow_back',
        class: 'rotate-270',
      },
      { label: tr('editor.delete'), value: 'tableDeleteRow', icon: 'delete' },
    ]
  })

  const cellInfo = computed(() => {
    const { state } = props.value!.editor
    const pos = props.value?.getPos()
    const $pos = state.doc.resolve(pos)

    let tableNode = null
    let tableStart = -1
    for (let d = $pos.depth; d > 0; d--) {
      if ($pos.node(d).type.name === 'table') {
        tableNode = $pos.node(d)
        tableStart = $pos.before(d)
        break
      }
    }

    if (!tableNode) return { rowIndex: -1, colIndex: -1 }

    const map = TableMap.get(tableNode)
    const relativePos = pos - tableStart - 1
    const cellRect = map.findCell(relativePos)

    return {
      rowIndex: cellRect.top,
      colIndex: cellRect.left,
    }
  })

  function initProps(value: any) {
    props.value = value
  }

  function selectColumn() {
    showColPopover.value = false
    runCommand('tableSelectColumn', {
      pos: props.value?.getPos(),
    })
  }

  function selectRow() {
    showRowPopover.value = false
    runCommand('tableSelectRow', {
      pos: props.value?.getPos(),
    })
  }

  function runCommand(command: string, options: Indexable = {}) {
    console.log('runCommand', command, options)
    switch (command) {
      case 'selectColumn':
        selectColumn()
        return
      case 'selectRow':
        selectRow()
        return
      case 'tableAddRowAfter':
      case 'tableAddRowBefore':
      case 'tableDeleteRow':
        showRowPopover.value = false
        break
      case 'tableAddColumnAfter':
      case 'tableAddColumnBefore':
      case 'tableDeleteColumn':
        showColPopover.value = false
        break
    }

    setTimeout(() => {
      run(props.value?.editor, command, options)
    }, 0)
  }

  return {
    showColPopover,
    showRowPopover,
    columnActions,
    rowActions,
    isEditable,
    cellInfo,
    initProps,
    selectColumn,
    selectRow,
    runCommand,
  }
}
