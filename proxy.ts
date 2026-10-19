import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // createServerClient와 getUser() 사이에 코드 삽입 금지 — 세션 갱신 트리거
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 미인증 + /story/new → /login
  if (!user && pathname === '/story/new') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 인증 + /login|/signup → /story
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/story', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    {
      source:
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
      // prefetch 요청은 proxy를 건너뛴다 — RSC prefetch마다 getUser(Auth 서버 왕복)가 쌓이는 걸
      // 막는다. 일반 요청·네비게이션·Server Action(next-action 헤더, prefetch 헤더 없음)은 그대로
      // 매칭되어 세션 쿠키 갱신(getUser)을 유지한다. (Next proxy 공식 예시)
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
