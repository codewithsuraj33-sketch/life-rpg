import { NextResponse } from 'next/server'
import { createClient } from '@/app/_lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      const redirectBase = isLocalEnv
        ? origin
        : forwardedHost
        ? `https://${forwardedHost}`
        : 'https://life-rpg-sooty.vercel.app'

      const targetPath = next.startsWith('/') ? next : `/${next}`
      return NextResponse.redirect(`${redirectBase}${targetPath}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth`)
}
