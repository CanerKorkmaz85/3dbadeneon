import { NextRequest, NextResponse } from 'next/server'

const INDEXNOW_KEY = '843ecf0721e74f4eb9142d34d6f908ee'
const SITE_URL = 'https://3dbadeneon.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const urls = Array.isArray(body.urls)
      ? body.urls
      : body.url
        ? [body.url]
        : []

    if (urls.length === 0) {
      return NextResponse.json(
        { error: 'Gönderilecek URL bulunamadı.' },
        { status: 400 }
      )
    }

    const absoluteUrls = urls.map((url: string) => {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
      }

      return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`
    })

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: '3dbadeneon.com',
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: absoluteUrls,
      }),
    })

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      urls: absoluteUrls,
    })
  } catch (error) {
    console.error('IndexNow error:', error)

    return NextResponse.json(
      { error: 'IndexNow bildirimi sırasında hata oluştu.' },
      { status: 500 }
    )
  }
}