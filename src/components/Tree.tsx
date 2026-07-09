import { useState } from 'react'

export interface TreeNode {
  label: string
  children?: TreeNode[]
}

interface TreeProps {
  nodes: TreeNode[]
  onSelect?: (label: string) => void
}

// 폴더처럼 펼치고 접는 계층 트리. 리프 클릭 시 onSelect 호출.
export function Tree({ nodes, onSelect }: Readonly<TreeProps>) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (label: string) => {
    setSelected(label)
    onSelect?.(label)
  }

  return (
    <ul className="tree">
      {nodes.map((node) => (
        <TreeItem
          key={node.label}
          node={node}
          selected={selected}
          onSelect={handleSelect}
        />
      ))}
    </ul>
  )
}

function TreeItem({
  node,
  selected,
  onSelect,
}: Readonly<{
  node: TreeNode
  selected: string | null
  onSelect: (label: string) => void
}>) {
  const [open, setOpen] = useState(false)
  const hasChildren = (node.children?.length ?? 0) > 0

  const handleClick = () => {
    if (hasChildren) setOpen((o) => !o)
    else onSelect(node.label)
  }

  return (
    <li className={`tree-item${open ? ' open' : ''}`}>
      <button
        type="button"
        className={`tree-row${selected === node.label ? ' selected' : ''}`}
        aria-expanded={hasChildren ? open : undefined}
        onClick={handleClick}
      >
        <span className={`tree-toggle${hasChildren ? '' : ' leaf'}`} aria-hidden="true" />
        {node.label}
      </button>
      {hasChildren && open && (
        <ul>
          {node.children!.map((child) => (
            <TreeItem
              key={child.label}
              node={child}
              selected={selected}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
