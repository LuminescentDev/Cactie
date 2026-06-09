
import { routeLoader$ } from '@qwik.dev/router';
import { getSessionFn } from '~/utils/auth';

// wrappers to use in server/client components
export const useSession = routeLoader$(async (requestEvent) => {
  const session = await getSessionFn(requestEvent);
  const { redirect } = requestEvent;
  if (requestEvent.url.href.includes('/dashboard') && !session) throw redirect(302, '/login');
  return session;
});