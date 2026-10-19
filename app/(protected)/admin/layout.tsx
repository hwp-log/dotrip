import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth/guard';
import { prisma } from '@/lib/prisma';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const user = await getAuthUser(supabase);
  if (!user) redirect('/');

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  if (profile?.role !== 'ADMIN') redirect('/');

  return <>{children}</>;
}
