import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  const clientId = process.env.OAUTH_CLIENT_ID
  const clientSecret = process.env.OAUTH_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:24px">
        <b>Errore di configurazione:</b> variabili d'ambiente OAUTH_CLIENT_ID o OAUTH_CLIENT_SECRET mancanti su Vercel.
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  if (!code) {
    console.log('[api/auth] step 1 — redirecting to GitHub, origin:', origin)
    const url = new URL('https://github.com/login/oauth/authorize')
    url.searchParams.set('client_id', clientId)
    url.searchParams.set('scope', 'repo,user')
    url.searchParams.set('redirect_uri', `${origin}/api/auth`)
    return NextResponse.redirect(url.toString())
  }

  console.log('[api/auth] step 2 — exchanging code for token')

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  })
  const data = await res.json() as { access_token?: string; error?: string; error_description?: string }

  if (!data.access_token) {
    const detail = data.error_description ?? data.error ?? JSON.stringify(data)
    console.error('[api/auth] token exchange failed:', data)
    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:24px">
        <b>Errore OAuth GitHub:</b> ${detail}
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  const message = `authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}`

  return new NextResponse(
    `<!DOCTYPE html><html><body><script>
      var msg = ${JSON.stringify(message)};
      if (window.opener) {
        // Decap usa un handshake a due passi:
        // 1. popup → opener: "authorizing:github"
        // 2. opener → popup: "authorizing:github"  (ack)
        // 3. popup → opener: "authorization:github:success:{...}"
        window.opener.postMessage('authorizing:github', window.location.origin);
        window.addEventListener('message', function(e) {
          if (e.origin === window.location.origin && e.data === 'authorizing:github') {
            window.opener.postMessage(msg, window.location.origin);
            window.close();
          }
        });
      } else {
        sessionStorage.setItem('__decap_pending_auth', msg);
        window.location.replace('/admin/');
      }
    <\/script></body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
