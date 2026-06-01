import type { RequestHandler } from '@qwik.dev/router';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { tursoDb } from '~/utils/drizzle';
import { sessions } from '@sova/drizzle-schema';

export const onGet: RequestHandler = async (requestEvent) => {
  const { url, redirect, cookie, env } = requestEvent;
  const code = url.searchParams.get('code');
  if (!code) {
    const state = crypto.randomUUID();
    cookie.set('oauth_state', state, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 300,
    });

    const oauthUrl = new URL(
      'https://discord.com/api/oauth2/authorize',
    );
    oauthUrl.searchParams.set('client_id', env.get('CLIENT_ID')!);
    oauthUrl.searchParams.set('redirect_uri', `${env.get('DOMAIN')}/login`);
    oauthUrl.searchParams.set('response_type', 'code');
    oauthUrl.searchParams.set('scope', 'identify guilds');
    oauthUrl.searchParams.set('state', state);

    throw redirect(302, oauthUrl.toString());
  }

  try {
    const state = url.searchParams.get('state');
    const expected = cookie.get('oauth_state')?.value;
    if (!state || state !== expected) {
      throw new Error('Invalid OAuth state');
    }
    cookie.delete('oauth_state', { path: '/' });

    const tokenResponseData = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: env.get('CLIENT_ID')!,
        client_secret: env.get('CLIENT_SECRET')!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${env.get('DOMAIN')}/login`,
        scope: 'identify guilds',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (!tokenResponseData.ok) {
      throw new Error('OAuth token exchange failed');
    }
    const oauthData = await tokenResponseData.json();
    const res = await fetch('https://discord.com/api/v10/users/@me', { headers: { authorization: `${oauthData.token_type} ${oauthData.access_token}` } });
    if (!res.ok) {
      throw new Error('Failed to fetch Discord user');
    }
    const userdata = await res.json();

    const db = await tursoDb(requestEvent);
    const session = await db.select()
      .from(sessions)
      .where(
        eq(sessions.discordId, userdata.id),
      )
      .get();

    let sessionId: string;
    if (!session) {
      sessionId = crypto.randomUUID();

      await db.insert(sessions)
        .values({
          sessionId: sessionId,
          discordId: userdata.id,
          accessToken: oauthData.access_token,
          refreshToken: oauthData.refresh_token,
          expiresAt: new Date(Date.now() + oauthData.expires_in * 1000),
          scope: oauthData.scope,
          pfp: userdata.avatar
            ? `https://cdn.discordapp.com/avatars/${userdata.id}/${userdata.avatar}`
            : null,
          accent: userdata.banner_color,
        })
        .run();
    }
    else {
      sessionId = session.sessionId;

      await db.update(sessions)
        .set({
          accessToken: oauthData.access_token,
          refreshToken: oauthData.refresh_token,
          expiresAt: new Date(Date.now() + oauthData.expires_in * 1000),
        })
        .where(eq(sessions.discordId, userdata.id))
        .run();
    };

    cookie.set('sessionid', sessionId, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

  } catch (error) {
    console.error(error);
    throw redirect(302, '/login?error=auth');
  }
  const href = cookie.get('redirecturl')?.value;
  throw redirect(302, href ?? '/');
};