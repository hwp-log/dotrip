import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth/guard';
import { prisma } from '@/lib/prisma';
import { AppHeader } from '@/app/(protected)/_components/AppHeader';
import { BottomTabBar } from '@/app/(protected)/_components/BottomTabBar';
import { ThemeScope } from '@/app/(protected)/_components/ThemeScope';
import { ProtectedMain } from '@/app/(protected)/_components/ProtectedMain';
import { Footer } from '@/app/(protected)/_components/Footer';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const user = await getAuthUser(supabase);
  const profile = user
    ? await prisma.user.findUnique({
        where: { id: user.id },
        select: { nickname: true, avatarUrl: true, role: true },
      })
    : null;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
      />
      <ThemeScope>
        <AppHeader
          isLoggedIn={!!user}
          email={user?.email ?? ''}
          avatarUrl={profile?.avatarUrl ?? null}
          nickname={profile?.nickname ?? ''}
          isAdmin={profile?.role === 'ADMIN'}
        />
        <ProtectedMain>{children}</ProtectedMain>
        <Footer />
        <BottomTabBar />
      </ThemeScope>
    </>
  );
}
