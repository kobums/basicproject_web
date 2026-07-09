import { Avatar } from './Avatar'

interface AvatarGroupProps {
  names: string[]
  max?: number // 이 수를 넘으면 "+N" 으로 요약
  size?: 'sm' | 'md' | 'lg'
}

// 아바타를 겹쳐 쌓고, 넘치는 인원은 "+N" 으로 표시.
export function AvatarGroup({ names, max = 4, size = 'md' }: Readonly<AvatarGroupProps>) {
  const visible = names.slice(0, max)
  const rest = names.length - visible.length

  return (
    <div className="avatar-group" title={names.join(', ')}>
      {visible.map((name) => (
        <Avatar key={name} name={name} size={size} />
      ))}
      {rest > 0 && (
        <span className={`avatar avatar-${size} avatar-more`}>+{rest}</span>
      )}
    </div>
  )
}
