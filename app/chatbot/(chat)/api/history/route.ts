import { getChatsByUserId } from '@/lib/db/queries';
import { getSession } from 'next-auth/react';

export async function GET() {
  const session = await getSession();

  if (!session || !session.user) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  // biome-ignore lint: Forbidden non-null assertion.
  const chats = await getChatsByUserId({ id: session.user.id! });
  return Response.json(chats);
}
