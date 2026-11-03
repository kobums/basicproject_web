import { describe, expect, it } from 'vitest'
import { mockFetch } from '../test/mockFetch'
import { uploadImage } from './upload'
import { ApiError } from '../gen/models/contract'
import { imageUrl } from '../lib/format'

const file = new File(['x'], 'a.png', { type: 'image/png' })

describe('uploadImage', () => {
  it('{filename, url} → url 을 쓴다 (그대로 열 수 있는 주소)', async () => {
    const calls = mockFetch({
      body: { filename: '20260101/a.png', url: '/uploads/20260101/a.png' },
    })
    const img = await uploadImage(file)
    expect(img).toBe('/uploads/20260101/a.png')
    expect(imageUrl(img)).toBe('/uploads/20260101/a.png')
    expect(calls[0]).toMatchObject({ url: '/api/upload/index', method: 'POST' })
    expect(calls[0].body).toBeInstanceOf(FormData)
  })

  it('url 이 없으면 filename (화면에서는 업로드 주소 앞부분을 붙인다)', async () => {
    mockFetch({ body: { filename: '20260101/b.png' } })
    const img = await uploadImage(file)
    expect(img).toBe('20260101/b.png')
    expect(imageUrl(img)).toBe('/uploads/20260101/b.png')
  })

  it('경로가 없거나 Go 식 code 에러면 던진다', async () => {
    mockFetch({ body: {} })
    await expect(uploadImage(file)).rejects.toBeInstanceOf(ApiError)
    mockFetch({ body: { code: 'auth error' } })
    await expect(uploadImage(file)).rejects.toBeInstanceOf(ApiError)
  })
})
