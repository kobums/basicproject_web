interface AvatarProps {
  name: string // 이니셜/색상 생성 + alt 텍스트
  src?: string | null // 있으면 이미지, 없으면 이니셜
  size?: 'sm' | 'md' | 'lg'
}

// 이름 문자열에서 항상 같은 색이 나오도록 해시 → 팔레트 매핑 (토스 팔레트 계열)
const PALETTE = ['#3182f6', '#1b64da', '#03b26c', '#02a262', '#fe9800', '#f04452', '#6b7684']

function colorOf(name: string): string {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

// 프로필 아바타. 이미지가 없으면 이름 첫 글자 + 이름 기반 고정 색상.
export function Avatar({ name, src, size = 'md' }: Readonly<AvatarProps>) {
  return (
    <span
      className={`avatar avatar-${size}`}
      style={src ? undefined : { background: colorOf(name) }}
      title={name}
    >
      {src ? <img src={src} alt={name} /> : name.charAt(0).toUpperCase()}
    </span>
  )
}
